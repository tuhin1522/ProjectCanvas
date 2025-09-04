from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('verify-email/<str:token>/', verify_email, name='verify_email'),
    path('resend-verification/', resend_verification, name='resend_verification'),
]