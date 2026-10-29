"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path , include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from accounts.views import (
    PasswordResetRequestView,
    PasswordResetConfirmView,
     LoginView,
     VerifyEmailView,
     ResendVerificationView,
     RegisterView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('portfolio/', include('portfolio.urls')),
    path('services/', include('services.urls')),
    path('contact/', include('contact.urls')),
    path('accounts/', include('accounts.urls')),
    path('api/', include('sitecontent.urls')),
    path(
    'api/auth/login/',
    LoginView.as_view(),
    name='api_login',
),
path(
    'api/auth/signup/',
    RegisterView.as_view(),
    name='api_signup',
),

path(
    'api/auth/verify-email/',
    VerifyEmailView.as_view(),
    name='api_verify_email',
),

path(
    'api/auth/resend-verification/',
    ResendVerificationView.as_view(),
    name='api_resend_verification',
),
    path('team/', include('team.urls')),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path(
    'api/auth/forgot-password/',
    PasswordResetRequestView.as_view(),
    name='password_reset_request',
),

path(
    'api/auth/reset-password/',
    PasswordResetConfirmView.as_view(),
    name='password_reset_confirm_api',
),
]


urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)