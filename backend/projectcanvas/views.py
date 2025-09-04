import json
import uuid
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from .models import User, PendingUser

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