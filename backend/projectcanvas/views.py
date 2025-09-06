import json
import uuid
import logging
import os
import traceback
import requests
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from .models import *

# Add docx import for document processing
try:
    import docx
except ImportError:
    docx = None

logger = logging.getLogger(__name__)
@csrf_exempt
def signup(request):
    """Handle first step of registration - store data in PendingUser"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Check if user already exists in either User or PendingUser
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            
            if PendingUser.objects.filter(email=data['email']).exists():
                # Delete the old pending user if it exists
                PendingUser.objects.filter(email=data['email']).delete()
            
            # Create verification token
            verification_token = str(uuid.uuid4())
            
            # Hash the password
            hashed_password = make_password(data['password'])
            
            # Create pending user
            pending_user = PendingUser.objects.create(
                name=data['name'],
                email=data['email'],
                phone_number=data['phone_number'],
                roll_number=data['roll_number'],
                registration_number=data['registration_number'],
                session=data['session'],
                department=data['department'],
                password=hashed_password,
                verification_token=verification_token
            )
            
            # Send verification email
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            verification_url = f"{frontend_url}/verify-email/{verification_token}"
            
            email_subject = "Verify Your ProjectCanvas Account"
            email_body = f"""
Hello {pending_user.name},

Thank you for signing up for ProjectCanvas! Please verify your email by clicking the link below:

{verification_url}

This verification link will expire after 3 minutes.

If you did not sign up for this account, please ignore this email.

Best regards,
The ProjectCanvas Team
            """
            
            try:
                send_mail(
                    email_subject,
                    email_body,
                    settings.DEFAULT_FROM_EMAIL,
                    [pending_user.email],
                    fail_silently=False,
                )
                
                return JsonResponse({
                    'message': 'Please check your email to verify your account.',
                    'email': pending_user.email,
                    'name': pending_user.name,
                    'verified': False
                })
            except Exception as e:
                logger.error(f"Email sending failed: {str(e)}")
                PendingUser.objects.filter(email=data['email']).delete()
                return JsonResponse({'error': 'Failed to send verification email. Please try again.'}, status=500)
                
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
        except Exception as e:
            logger.error(f"Signup error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def verify_email(request, token):
    """Verify email and create actual user from pending user"""
    try:
        # Find the pending user with this token
        try:
            pending_user = PendingUser.objects.get(verification_token=token)
        except PendingUser.DoesNotExist:
            # Check if this user was already verified (token already used)
            # This is a better way to check than trying to match partial email with token
            existing_user = User.objects.filter(email_verified=True).order_by('-date_joined').first()
            if existing_user and (timezone.now() - existing_user.date_joined).total_seconds() < 300:  # within last 5 minutes
                return JsonResponse({'message': 'Your email was already verified! You can now log in.', 'verified': True})
            return JsonResponse({'error': 'Invalid or expired verification link.'}, status=400)
        
        # Check if token is expired (3 minutes)
        expiration_time = timezone.now() - timezone.timedelta(minutes=3)
        if pending_user.created_at < expiration_time:
            # Delete expired pending user
            pending_user.delete()
            return JsonResponse({'error': 'Verification link has expired. Please register again.'}, status=400)
            
        # Create actual user
        user = User.objects.create_user(
            name=pending_user.name,
            email=pending_user.email,
            password=None,  # Will set manually from the stored hash
            phone_number=pending_user.phone_number,
            roll_number=pending_user.roll_number,
            registration_number=pending_user.registration_number,
            session=pending_user.session,
            department=pending_user.department,
            email_verified=True
        )
        
        # Set password directly from the hashed password
        user.password = pending_user.password
        user.save()
        
        # Delete the pending user
        pending_user.delete()
        
        return JsonResponse({
            'message': 'Email verified successfully! You can now log in.',
            'verified': True
        })
    except Exception as e:
        logger.error(f"Verification error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def login_view(request):
    """Handle user login"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email', '')
            password = data.get('password', '')
            
            # Check if user exists in pending_users
            if PendingUser.objects.filter(email=email).exists():
                return JsonResponse({
                    'error': 'Please verify your email before logging in. Check your inbox for the verification link.',
                    'pending': True
                }, status=401)
                
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                login(request, user)
                
                # Update last login time
                user.last_login = timezone.now()
                user.save(update_fields=['last_login'])
                
                return JsonResponse({
                    'message': 'Login successful',
                    'user_id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'department': user.department
                })
            else:
                return JsonResponse({'error': 'Invalid email or password'}, status=401)
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def resend_verification(request):
    """Resend verification email for pending user"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            try:
                # Check if a pending user exists
                pending_user = PendingUser.objects.get(email=email)
                
                # Generate new token
                verification_token = str(uuid.uuid4())
                pending_user.verification_token = verification_token
                pending_user.created_at = timezone.now()  # Reset expiration timer
                pending_user.save()
                
                # Send verification email
                frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
                verification_url = f"{frontend_url}/verify-email/{verification_token}"
                
                email_subject = "Verify Your ProjectCanvas Account"
                email_body = f"""
Hello {pending_user.name},

Please verify your email by clicking the link below:

{verification_url}

This verification link will expire after 24 hours.

If you did not sign up for this account, please ignore this email.

Best regards,
The ProjectCanvas Team
                """
                
                send_mail(
                    email_subject,
                    email_body,
                    settings.DEFAULT_FROM_EMAIL,
                    [pending_user.email],
                    fail_silently=False,
                )
                
                return JsonResponse({'message': 'Verification email sent successfully'})
                
            except PendingUser.DoesNotExist:
                # Don't reveal that the user doesn't exist
                return JsonResponse({'message': 'If your email is registered, a verification link has been sent'})
                
        except Exception as e:
            logger.error(f"Resend verification error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def forgot_password(request):
    """Handle forgot password request and send reset email"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            user = User.objects.filter(email=email).first()
            if not user:
                # Don't reveal if user exists
                return JsonResponse({'message': 'If your email is registered, a reset link has been sent.'})
            # Generate token and expiration
            reset_token = str(uuid.uuid4())
            user.reset_token = reset_token
            user.reset_token_created = timezone.now()
            user.save()
            # Send email
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_url = f"{frontend_url}/reset-password/{reset_token}"
            email_subject = "Reset Your ProjectCanvas Password"
            email_body = f"""
Hello {user.name},

You requested a password reset. Click the link below to set a new password:

{reset_url}

This link will expire in 10 minutes.

If you did not request this, please ignore this email.

Best regards,
ProjectCanvas Team
"""
            send_mail(
                email_subject,
                email_body,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return JsonResponse({'message': 'If your email is registered, a reset link has been sent.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def reset_password(request, token):
    """Handle password reset via token"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            password = data.get('password')
            user = User.objects.filter(reset_token=token).first()
            if not user:
                return JsonResponse({'error': 'Invalid or expired token.'}, status=400)
            # Check expiration (10 minutes)
            expiration_time = user.reset_token_created + timezone.timedelta(minutes=10)
            if timezone.now() > expiration_time:
                user.reset_token = None
                user.save()
                return JsonResponse({'error': 'Token expired.'}, status=400)
            # Set new password
            user.set_password(password)
            user.reset_token = None
            user.save()
            return JsonResponse({'message': 'Password reset successful.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

def extract_text_from_path(path):
    ext = os.path.splitext(path)[1].lower()
    text = ""
    try:
        if ext == '.pdf':
            from PyPDF2 import PdfReader
            reader = PdfReader(path)
            for p in reader.pages:
                page_text = p.extract_text()
                if page_text:
                    text += page_text + "\n"
        elif ext == '.docx':
            import docx
            doc = docx.Document(path)
            text = "\n".join(p.text for p in doc.paragraphs)
        else:
            # txt or fallback
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
    except Exception as e:
        text = ""
    return text

def call_gemini_analysis(text):
    """
    Use Gemini API to analyze project documentation and generate a comprehensive project page.
    """
    if not text:
        return ""
        
    api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyBJdv3jaa5GOAPCFKdNIdY94urMlilVxxY')
    payload_text = text[:14000]  # keep payload reasonable
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={api_key}"

    # Your specific prompt
    prompt = (
        "Please analyze the following document and create a comprehensive project page. "
        "Structure your response with the following sections:\n\n"
        "1. Project Title & Tagline - Keep it short, professional, and impactful.\n"
        "2. Problem Statement - Explain the challenge your project solves.\n"
        "3. Objectives - List your clear goals (from your report).\n"
        "4. Key Features - Highlight your system's capabilities\n"
        "5. System Architecture / Workflow - Explain the flow (with diagram if possible).\n"
        "6. Implementation Details - used technologies.\n"
        "7. Results & Screenshots - show image.\n"
        "8. Future Scope - Mention improvements can be possible.\n\n"
        "Please format your response in clean HTML with appropriate headings and structure.\n\n"
        "Documentation to analyze:\n\n" + payload_text
    )

    body = {
        "prompt": {"text": prompt},
        "temperature": 0.2,
        "maxOutputTokens": 2000
    }

    try:
        resp = requests.post(url, json=body, timeout=35)
        resp.raise_for_status()
        data = resp.json()

        # Extract generated text
        generated_text = ""
        if isinstance(data, dict):
            if 'candidates' in data and data['candidates']:
                cand = data['candidates'][0]
                generated_text = cand.get('content', '') or cand.get('output', '') or ""
            elif 'output' in data:
                out = data['output']
                if isinstance(out, str):
                    generated_text = out
                elif isinstance(out, dict):
                    generated_text = out.get('content', '') or out.get('text', '') or ""

        return generated_text or "<p>Could not generate project page content.</p>"
        
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}")
        return f"<p class='error'>Could not analyze document: {str(e)}</p>"


@csrf_exempt
def upload_project(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    try:
        print("Upload request received")  # Debug log
        print("POST data:", request.POST)  # Debug log
        print("FILES data:", request.FILES)  # Debug log
        
        # Extract all form data
        title = request.POST.get('title', '')
        description = request.POST.get('description', '')
        author_name = request.POST.get('author_name', '')
        author_email = request.POST.get('author_email', '')
        department = request.POST.get('department', '')
        academic_year = request.POST.get('academic_year', '')
        supervisor = request.POST.get('supervisor', '')
        project_type = request.POST.get('project_type', '')
        is_open_source = request.POST.get('is_open_source', 'true').lower() in ['true', '1', 'yes']
        github_link = request.POST.get('github_link', '')
        live_demo_link = request.POST.get('live_demo_link', '')
        
        # Parse technologies (JSON array)
        technologies_used = []
        try:
            technologies_raw = request.POST.get('technologies_used', '[]')
            technologies_used = json.loads(technologies_raw)
        except Exception as e:
            print(f"Technologies parsing error: {e}")
            pass

        project_file = request.FILES.get('project_file')
        documentation_file = request.FILES.get('documentation_file', None)

        if not project_file:
            return JsonResponse({'error': 'project_file required'}, status=400)

        if not title.strip():
            return JsonResponse({'error': 'Project title is required'}, status=400)

        print(f"Creating project with title: {title}")  # Debug log

        # Create Project instance with all data
        project = Project.objects.create(
            title=title,
            description=description,
            author_name=author_name,
            author_email=author_email,
            department=department,
            academic_year=academic_year,
            supervisor=supervisor,
            project_type=project_type,
            is_open_source=is_open_source,
            github_link=github_link,
            live_demo_link=live_demo_link,
            technologies_used=technologies_used,
            is_draft=True,  # Save as draft initially
            is_published=False
        )

        print(f"Project created with ID: {project.id}")  # Debug log

        # Save main file
        project.project_file.save(project_file.name, project_file, save=True)

        # Save documentation if provided (but don't analyze yet)
        if documentation_file:
            project.documentation_file.save(documentation_file.name, documentation_file, save=True)
            try:
                doc_path = project.documentation_file.path
                doc_text = extract_text_from_path(doc_path)
                project.documentation_text = doc_text
            except Exception as e:
                print(f"Documentation processing error: {e}")
                # Continue even if doc processing fails

        # Handle screenshots
        screenshots_list = []
        idx = 0
        while True:
            key = f'screenshot_{idx}'
            if key not in request.FILES:
                break
            try:
                f = request.FILES[key]
                subdir = f'screenshots/{project.id}'
                save_path = f'{subdir}/{f.name}'
                from django.core.files.storage import default_storage
                saved_name = default_storage.save(save_path, f)
                screenshots_list.append(default_storage.url(saved_name))
                idx += 1
            except Exception as e:
                print(f"Screenshot processing error: {e}")
                break
                
        if screenshots_list:
            project.screenshots = screenshots_list

        project.save()

        print(f"Project saved successfully with ID: {project.id}")  # Debug log

        return JsonResponse({
            'project_id': project.id, 
            'status': 'draft',
            'message': 'Project saved successfully'
        })
        
    except Exception as e:
        tb = traceback.format_exc()
        logger.error(f"upload_project exception: {str(e)}\n{tb}")
        print(f"Upload error: {str(e)}")  # Debug log
        print(f"Traceback: {tb}")  # Debug log
        
        if getattr(settings, 'DEBUG', False):
            return JsonResponse({'error': str(e), 'trace': tb}, status=500)
        return JsonResponse({'error': 'Internal server error'}, status=500)


def get_project(request, pk):
    try:
        project = Project.objects.get(pk=pk)
        data = {
            'id': project.id,
            'title': project.title,
            'project_file_url': project.project_file.url if project.project_file else '',
            'documentation_file_url': project.documentation_file.url if project.documentation_file else '',
            'documentation_text': project.documentation_text,
            'analysis_text': project.analysis_text,
            'project_type': project.project_type,
            'is_open_source': project.is_open_source,
            'github_link': project.github_link,
            'screenshots': project.screenshots,
            'created_at': project.created_at.isoformat(),
        }
        return JsonResponse(data)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

@csrf_exempt
def generate_project_page(request, pk):
    """Generate project page using Gemini analysis"""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    
    try:
        project = Project.objects.get(pk=pk)
        
        if not project.documentation_text:
            return JsonResponse({'error': 'No documentation found to analyze'}, status=400)
        
        # Generate analysis using Gemini
        analysis = call_gemini_analysis(project.documentation_text)
        project.analysis_text = analysis
        project.save()
        
        return JsonResponse({
            'success': True,
            'analysis': analysis,
            'project_id': project.id
        })
        
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        logger.error(f"Generate project page error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def publish_project(request, pk):
    """Publish the project (make it public)"""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    
    try:
        project = Project.objects.get(pk=pk)
        project.is_published = True
        project.is_draft = False
        project.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Project published successfully',
            'project_id': project.id
        })
        
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def create_blog_post(request):
    """Create a new blog post"""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    try:
        print("Blog post creation request received")
        print("POST data:", request.POST)
        print("FILES data:", request.FILES)
        
        # Extract form data
        title = request.POST.get('title', '').strip()
        excerpt = request.POST.get('excerpt', '').strip()
        content = request.POST.get('content', '').strip()
        category = request.POST.get('category', '').strip()
        author_name = request.POST.get('authorName', '').strip()
        author_email = request.POST.get('authorEmail', '').strip()
        author_role = request.POST.get('authorRole', '').strip()
        
        try:
            estimated_read_time = int(request.POST.get('estimatedReadTime', 5))
        except (ValueError, TypeError):
            estimated_read_time = 5
        
        # Parse tags
        tags = []
        try:
            tags_raw = request.POST.get('tags', '[]')
            if tags_raw:
                tags = json.loads(tags_raw)
        except Exception as e:
            print(f"Tags parsing error: {e}")
            tags = []
        
        print(f"Parsed data - Title: {title}, Category: {category}, Author: {author_name}")
        
        # Validation
        if not title:
            return JsonResponse({'error': 'Title is required'}, status=400)
        if not content:
            return JsonResponse({'error': 'Content is required'}, status=400)
        if not category:
            return JsonResponse({'error': 'Category is required'}, status=400)
        if not author_name:
            return JsonResponse({'error': 'Author name is required'}, status=400)
        if not author_email:
            return JsonResponse({'error': 'Author email is required'}, status=400)
        
        # Create blog post
        blog_post = BlogPost.objects.create(
            title=title,
            excerpt=excerpt,
            content=content,
            category=category,
            tags=tags,
            author_name=author_name,
            author_email=author_email,
            author_role=author_role,
            estimated_read_time=estimated_read_time
        )
        
        print(f"Blog post created with ID: {blog_post.id}")
        
        # Handle cover image if provided
        cover_image = request.FILES.get('coverImage')
        if cover_image:
            print(f"Processing cover image: {cover_image.name}")
            blog_post.cover_image.save(cover_image.name, cover_image, save=True)
        
        return JsonResponse({
            'success': True,
            'blog_post_id': blog_post.id,
            'message': 'Blog post created successfully'
        })
        
    except Exception as e:
        print(f"Error creating blog post: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        logger.error(f"Create blog post error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_blog_posts(request):
    """Get all published blog posts"""
    try:
        posts = BlogPost.objects.filter(is_published=True)
        
        # Apply filters if provided
        category = request.GET.get('category')
        search = request.GET.get('search')
        
        if category:
            posts = posts.filter(category=category)
        
        if search:
            posts = posts.filter(
                Q(title__icontains=search) | 
                Q(excerpt__icontains=search) | 
                Q(content__icontains=search)
            )
        
        posts_data = []
        for post in posts:
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'excerpt': post.excerpt,
                'category': post.category,
                'tags': post.tags,
                'author': post.author_name,
                'authorRole': post.author_role,
                'date': post.created_at.isoformat(),
                'readTime': post.estimated_read_time,
                'image': post.cover_image_url or "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3"
            })
        
        return JsonResponse({
            'success': True,
            'posts': posts_data
        })
        
    except Exception as e:
        logger.error(f"Get blog posts error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt 
def get_blog_post(request, pk):
    """Get a specific blog post"""
    try:
        post = BlogPost.objects.get(pk=pk, is_published=True)
        
        post_data = {
            'id': post.id,
            'title': post.title,
            'excerpt': post.excerpt,
            'content': post.content,
            'category': post.category,
            'tags': post.tags,
            'author': post.author_name,
            'authorEmail': post.author_email,
            'authorRole': post.author_role,
            'date': post.created_at.isoformat(),
            'readTime': post.estimated_read_time,
            'image': post.cover_image_url
        }
        
        return JsonResponse({
            'success': True,
            'post': post_data
        })
        
    except BlogPost.DoesNotExist:
        return JsonResponse({'error': 'Blog post not found'}, status=404)
    except Exception as e:
        logger.error(f"Get blog post error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)