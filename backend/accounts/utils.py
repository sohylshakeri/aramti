import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils import timezone

from .models import EmailVerification


def create_email_verification(user):
    # باطل کردن درخواست‌های تأیید قبلی کاربر
    EmailVerification.objects.filter(
        user=user,
        is_used=False,
    ).update(is_used=True)

    # تولید کد تصادفی شش‌رقمی
    code = f'{secrets.randbelow(1_000_000):06d}'

    # تعیین زمان انقضای کد: ۱۰ دقیقه
    expires_at = timezone.now() + timedelta(minutes=10)

    # ذخیره هش کد به‌جای خود کد
    verification = EmailVerification.objects.create(
        user=user,
        code_hash=make_password(code),
        expires_at=expires_at,
    )

    # ارسال کد به ایمیل کاربر
    subject = 'Verify your email address'

    message = (
        f'Hello {user.username},\n\n'
        f'Your email verification code is: {code}\n\n'
        'This code expires in 10 minutes.\n\n'
        'If you did not create this account, you can ignore this email.'
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )

    return verification