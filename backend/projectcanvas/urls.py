from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('verify-email/<str:token>/', verify_email, name='verify_email'),
    path('resend-verification/', resend_verification, name='resend_verification'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('reset-password/<str:token>/', reset_password, name='reset_password'),

    path('upload-project/', upload_project, name='upload_project'),
    path('projects/<int:pk>/', get_project, name='get_project'),
    path('api/projects/<int:pk>/generate/', generate_project_page, name='generate_project_page'),
    path('api/projects/<int:pk>/publish/', publish_project, name='publish_project'),
     # Blog URLs
    path('blog/create/', create_blog_post, name='create_blog_post'),
    path('blog/posts/', get_blog_posts, name='get_blog_posts'),
    path('blog/posts/<int:pk>/', get_blog_post, name='get_blog_post'),
]