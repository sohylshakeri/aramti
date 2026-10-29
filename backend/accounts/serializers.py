from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User
import re

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    confirm_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        return attrs
class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
    read_only=True
)
    
    user_id = serializers.IntegerField(
        source='user.id',
        read_only=True,
    )

    username = serializers.CharField(
        source='user.username',
        read_only=True,
    )

    email = serializers.EmailField(
        source='user.email',
        read_only=True,
    )

    first_name = serializers.CharField(
        source='user.first_name',
        required=False,
        allow_blank=True,
        max_length=150,
    )

    last_name = serializers.CharField(
        source='user.last_name',
        required=False,
        allow_blank=True,
        max_length=150,
    )

    phone = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=20,
    )


    class Meta:
        model = Profile

        fields = [
            'id',
            'user',
            'user_id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'avatar',
        ]

        read_only_fields = [
            'id',
            'user',
            'user_id',
            'username',
            'email',
        ]

        def validate_phone(self, value):
            phone = re.sub(r'[\s()-]', '', value)

            if not phone:
                return ''

            if not re.fullmatch(r'\+?[1-9]\d{7,14}', phone):
                raise serializers.ValidationError(
                    'Enter a valid phone number.'
                )

            duplicate = Profile.objects.filter(phone=phone)

            if self.instance:
                duplicate = duplicate.exclude(pk=self.instance.pk)

            if duplicate.exists():
                raise serializers.ValidationError(
                    'An account with this phone number already exists.'
                )

            return phone

        def update(self, instance, validated_data):
            user_data = validated_data.pop('user', {})

            user = instance.user

            for field, value in user_data.items():
                setattr(user, field, value)

            if user_data:
                user.save(update_fields=list(user_data.keys()))

            return super().update(instance, validated_data)

    
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        allow_blank=False,
    )

    phone = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
        trim_whitespace=True,
    )

    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone',
            'password',
        ]
        read_only_fields = ['id']

    def validate_email(self, value):
        email = value.strip().lower()

        # جلوگیری از ثبت ایمیل تکراری
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                'An account with this email already exists.'
            )

        return email

    def validate_phone(self, value):
        # حذف فاصله و جداکننده‌های رایج شماره تلفن
        phone = re.sub(r'[\s()-]', '', value)

        # در صورت اختیاری بودن شماره تلفن، مقدار خالی مجاز است.
        if not phone:
            return ''

        # فرمت بین‌المللی: 8 تا 15 رقم، با + اختیاری
        if not re.fullmatch(r'\+?[1-9]\d{7,14}', phone):
            raise serializers.ValidationError(
                'Enter a valid phone number.'
            )

        # جلوگیری از استفاده مجدد از شماره تلفن ثبت‌شده
        if Profile.objects.filter(phone=phone).exists():
            raise serializers.ValidationError(
                'An account with this phone number already exists.'
            )

        return phone

    def validate(self, attrs):
        candidate_user = User(
            username=attrs['username'],
            email=attrs['email'],
        )

        # اعمال قوانین رمز عبور تعریف‌شده در Django
        try:
            validate_password(
                attrs['password'],
                user=candidate_user,
            )
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                'password': error.messages,
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        password = validated_data.pop('password')

        # حساب جدید تا زمان تکمیل تأیید ایمیل غیرفعال می‌ماند.
        user = User.objects.create_user(
            password=password,
            is_active=False,
            **validated_data,
        )

        # اگر سیگنال پروژه Profile را ساخته باشد، همان را دریافت می‌کنیم.
        # در غیر این صورت، Profile ساخته می‌شود.
        profile, _ = Profile.objects.get_or_create(user=user)

        profile.phone = phone
        profile.email_verified = False

        profile.save(
            update_fields=['phone', 'email_verified']
        )

        return user

class LoginSerializer(serializers.Serializer):
    method = serializers.ChoiceField(
        choices=['email', 'username']
    )
    identifier = serializers.CharField(
        trim_whitespace=True
    )
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    code = serializers.RegexField(
        regex=r'^\d{6}$',
        error_messages={
            'invalid': 'Enter a valid six-digit verification code.',
        },
    )

    verificationId = serializers.UUIDField(
        source='verification_id',
    )


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    verificationId = serializers.UUIDField(
        source='verification_id',
    )