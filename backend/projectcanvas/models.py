from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.core.management import call_command
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=11)
    roll_number = models.CharField(max_length=50)
    registration_number = models.CharField(max_length=50)
    session = models.CharField(max_length=20)
    department = models.CharField(max_length=100)
    
    # Required fields for AbstractBaseUser
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Email verification
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, null=True, blank=True)
    verification_token_created = models.DateTimeField(null=True, blank=True)

    # Add to User model
    reset_token = models.CharField(max_length=100, null=True, blank=True)
    reset_token_created = models.DateTimeField(null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def __str__(self):
        return self.email
    
    @property
    def is_verification_expired(self):
        """Check if verification token is expired (24 hours)"""
        if not self.verification_token_created:
            return False
        expiration_time = timezone.timedelta(minutes=3)
        return timezone.now() > self.verification_token_created + expiration_time

    class Meta:
        db_table = 'users'


class PendingUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=11)
    roll_number = models.CharField(max_length=50)
    registration_number = models.CharField(max_length=50)
    session = models.CharField(max_length=20)
    department = models.CharField(max_length=100)
    password = models.CharField(max_length=128)  # Will store the hashed password
    verification_token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'pending_users'

class Project(models.Model):
    # Basic Information
    title = models.CharField(max_length=255, blank=True)  # You may want to add a title field in your form
    description = models.TextField(blank=True)            # Optionally add description field
    project_type = models.CharField(max_length=50)
    is_open_source = models.BooleanField(default=True)
    github_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Files
    project_file = models.FileField(upload_to='projects/')
    documentation_file = models.FileField(upload_to='documentation/', null=True, blank=True)

    # Screenshots (up to 10)
    # Store as separate model for multiple images
    # See Screenshot model below

    def __str__(self):
        return self.title or f"Project {self.id}"

class Screenshot(models.Model):
    project = models.ForeignKey(Project, related_name='screenshots', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='screenshots/')

    def __str__(self):
        return f"Screenshot for {self.project.title or self.project.id}"


class BlogPost(models.Model):
    # Blog Information (from WriteBlog form)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    content = models.TextField()
    cover_image = models.ImageField(upload_to='blog_covers/', blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    
    # Author Information (auto-filled from login + form inputs)
    author_name = models.CharField(max_length=100)
    author_email = models.EmailField()
    author_role = models.CharField(max_length=100, blank=True)
    estimated_read_time = models.IntegerField(default=5)
    
    # System fields
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def cover_image_url(self):
        if self.cover_image:
            return self.cover_image.url
        return None