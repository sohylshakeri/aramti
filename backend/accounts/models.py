import uuid

from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    email_verified = models.BooleanField(
        default=False,
    )

    avatar = models.ImageField(
        blank=True,
        default='avatars/default.png',
        upload_to='avatar/',
    )

    def __str__(self):
        return self.user.username


class EmailVerification(models.Model):
    # شناسه مستقل برای هر درخواست تأیید ایمیل
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='email_verifications',
    )

    # هش کد تأیید؛ خود کد خام در دیتابیس ذخیره نمی‌شود.
    code_hash = models.CharField(
        max_length=128,
    )

    # زمان انقضای کد
    expires_at = models.DateTimeField()

    # تعداد تلاش‌ها برای واردکردن کد
    attempts = models.PositiveSmallIntegerField(
        default=0,
    )

    # جلوگیری از استفاده مجدد از کد
    is_used = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f'Email verification for {self.user.username}'