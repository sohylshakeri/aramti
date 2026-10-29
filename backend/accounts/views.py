from django.shortcuts import render
from rest_framework.throttling import ScopedRateThrottle
from rest_framework import generics, permissions
from .models import Profile
from .serializers import ProfileSerializer ,LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import generics
from django.conf import settings
from django.contrib.auth import get_user_model ,authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.hashers import check_password
from django.db import transaction
from django.utils import timezone

from .models import EmailVerification
from .utils import create_email_verification

from .serializers import (
    RegisterSerializer,
    EmailVerificationSerializer,
    ResendVerificationSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response




# Create your views here.
class LoginView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        method = serializer.validated_data['method']
        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']

        User = get_user_model()
        user = None

        if method == 'email':
            # پیدا کردن حساب‌های دارای این ایمیل
            candidates = User.objects.filter(
                email__iexact=identifier,
                is_active=True,
            )

            # بررسی رمز عبور حساب‌های پیدا شده
            for candidate in candidates:
                authenticated_user = authenticate(
                    request=request,
                    username=candidate.get_username(),
                    password=password,
                )

                if authenticated_user is not None:
                    user = authenticated_user
                    break

        else:
            # ورود با نام کاربری
            user = authenticate(
                request=request,
                username=identifier,
                password=password,
            )

        if user is None:
            return Response(
                {
                    'detail': 'Invalid email/username or password.'
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # تولید JWT پس از احراز هویت موفق
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'user': {
                    'id': user.pk,
                    'username': user.get_username(),
                    'email': user.email,
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_200_OK,
        )

class PasswordResetRequestView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        User = get_user_model()

        users = User.objects.filter(
            email__iexact=email,
            is_active=True,
        )

        for user in users:
            # حساب‌هایی که رمز محلی قابل استفاده ندارند
            # نباید از این مسیر بازیابی شوند.
            if not user.has_usable_password():
                continue

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            frontend_url = getattr(
                settings,
                'FRONTEND_BASE_URL',
                'http://localhost:5173',
            ).rstrip('/')

            reset_link = (
                f'{frontend_url}/reset-password/'
                f'?uid={uid}&token={token}'
            )

            subject = 'Reset your password'

            message = (
                'We received a request to reset your password.\n\n'
                f'Use the following link to choose a new password:\n\n'
                f'{reset_link}\n\n'
                'If you did not request this, you can ignore this email.'
            )

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

        # پاسخ یکسان، چه حساب وجود داشته باشد و چه نداشته باشد.
        return Response(
            {
                'detail': (
                    'If an eligible account exists for this email, '
                    'a password reset link has been sent.'
                )
            },
            status=status.HTTP_200_OK,
        )

class PasswordResetConfirmView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset_confirm'
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        User = get_user_model()

        # بازیابی شناسه کاربر از uid رمزگذاری‌شده
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
        except (ValueError, TypeError, OverflowError, UnicodeDecodeError):
            return Response(
                {'detail': 'Invalid or expired reset link.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(
            pk=user_id,
            is_active=True,
        ).first()

        # اعتبارسنجی توکن با سازوکار داخلی Django
        if user is None or not default_token_generator.check_token(
            user,
            token,
        ):
            return Response(
                {'detail': 'Invalid or expired reset link.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # اعمال Password Validators تعریف‌شده در تنظیمات Django
        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as error:
            return Response(
                {'new_password': error.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # تغییر رمز با متد امن مدل کاربر
        user.set_password(new_password)
        user.save(update_fields=['password'])

        return Response(
            {'detail': 'Your password has been reset successfully.'},
            status=status.HTTP_200_OK,
        )

class VerifyEmailView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'verify_email'
    permission_classes = [AllowAny]
    authentication_classes = []

    MAX_ATTEMPTS = 5

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].strip()
        code = serializer.validated_data['code']
        verification_id = serializer.validated_data['verification_id']

        verification = (
            EmailVerification.objects
            .select_related('user')
            .filter(
                pk=verification_id,
                user__email__iexact=email,
                is_used=False,
            )
            .first()
        )

        if verification is None:
            return Response(
                {'detail': 'Invalid or expired verification request.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = verification.user

        if user.is_active:
            return Response(
                {'detail': 'This account is already active.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.expires_at <= timezone.now():
            verification.is_used = True
            verification.save(update_fields=['is_used'])

            return Response(
                {'detail': 'The verification code has expired.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.attempts >= self.MAX_ATTEMPTS:
            verification.is_used = True
            verification.save(update_fields=['is_used'])

            return Response(
                {'detail': 'Too many attempts. Request a new code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verification.attempts += 1

        if not check_password(code, verification.code_hash):
            if verification.attempts >= self.MAX_ATTEMPTS:
                verification.is_used = True

            verification.save(
                update_fields=['attempts', 'is_used']
            )

            return Response(
                {'detail': 'Incorrect verification code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            verification.is_used = True
            verification.save(update_fields=['is_used'])

            user.is_active = True
            user.save(update_fields=['is_active'])

            profile, _ = Profile.objects.get_or_create(user=user)
            profile.email_verified = True
            profile.save(update_fields=['email_verified'])

            # باطل‌کردن سایر درخواست‌های تأیید استفاده‌نشده
            EmailVerification.objects.filter(
                user=user,
                is_used=False,
            ).update(is_used=True)

       # صدور توکن‌های JWT پس از تأیید موفق ایمیل
        refresh = RefreshToken.for_user(user)

        return Response(
    {
        'detail': 'Email verified successfully.',
        'user': {
            'id': user.pk,
            'username': user.get_username(),
            'email': user.email,
            'phone': profile.phone,
        },
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    },
    status=status.HTTP_200_OK,
)

class ResendVerificationView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'resend_verification'
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].strip()
        verification_id = serializer.validated_data['verification_id']

        User = get_user_model()

        user = User.objects.filter(
            email__iexact=email,
            is_active=False,
        ).first()

        # پاسخ عمومی برای جلوگیری از افشای اطلاعات حساب‌ها
        generic_response = {
            'detail': (
                'If an eligible verification request exists, '
                'a new code has been sent.'
            )
        }

        if user is None:
            return Response(
                generic_response,
                status=status.HTTP_200_OK,
            )

        previous_verification = EmailVerification.objects.filter(
            pk=verification_id,
            user=user,
        ).first()

        if previous_verification is None:
            return Response(
                generic_response,
                status=status.HTTP_200_OK,
            )

        verification = create_email_verification(user)

        return Response(
            {
                **generic_response,
                'verificationId': str(verification.id),
            },
            status=status.HTTP_200_OK,
        )

class RegisterView(generics.CreateAPIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'signup'
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            user = serializer.save()

            verification = create_email_verification(user)

        return Response(
            {
                'detail': 'Registration successful. Verification code sent.',
                'email': user.email,
                'verificationId': str(verification.id),
                'user': {
                    'id': user.pk,
                    'username': user.username,
                    'email': user.email,
                    'phone': user.profile.phone,
                },
            },
            status=status.HTTP_201_CREATED,
        )
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'detail': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except TokenError:
            return Response(
                {'detail': 'Invalid or expired refresh token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {'detail': 'Successfully logged out.'},
            status=status.HTTP_205_RESET_CONTENT
        )