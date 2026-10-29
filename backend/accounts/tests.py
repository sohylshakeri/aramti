import re
from urllib.parse import urlparse, parse_qs

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase
from django.core.cache import cache

from accounts.models import EmailVerification, Profile


User = get_user_model()


class AuthenticationAPITests(APITestCase):
    """
    تست‌های ورود، پروفایل و خروج از حساب.
    """

    def setUp(self):
        self.password = 'Strong-Test-Password_2026!'

        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password=self.password,
            is_active=True,
        )

        self.profile, _ = Profile.objects.get_or_create(
            user=self.user,
        )

        self.profile.phone = '+491234567890'
        self.profile.email_verified = True
        self.profile.save()

    def test_login_with_email_returns_jwt_tokens(self):
        """
        ورود با ایمیل باید Access و Refresh Token برگرداند.
        """
        response = self.client.post(
            '/api/auth/login/',
            {
                'method': 'email',
                'identifier': self.user.email,
                'password': self.password,
                'remember': False,
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        self.assertEqual(
            response.data['user']['email'],
            self.user.email,
        )

    def test_login_with_wrong_password_fails(self):
        """
        رمز اشتباه نباید باعث ورود کاربر شود.
        """
        response = self.client.post(
            '/api/auth/login/',
            {
                'method': 'email',
                'identifier': self.user.email,
                'password': 'Wrong-Password_123!',
                'remember': False,
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_profile_requires_authentication(self):
        """
        کاربر ناشناس نباید بتواند پروفایل را دریافت کند.
        """
        response = self.client.get('/accounts/profile/')

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_authenticated_user_can_get_profile(self):
        """
        درخواست دارای JWT معتبر باید به پروفایل دسترسی داشته باشد.
        """
        login_response = self.client.post(
            '/api/auth/login/',
            {
                'method': 'email',
                'identifier': self.user.email,
                'password': self.password,
            },
            format='json',
        )

        self.assertEqual(
            login_response.status_code,
            status.HTTP_200_OK,
        )

        access_token = login_response.data['access']

        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {access_token}',
        )

        response = self.client.get('/accounts/profile/')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data['user'],
            self.user.id,
        )

    def test_logout_blacklists_refresh_token(self):
        """
        خروج باید Refresh Token را باطل کند.
        """
        login_response = self.client.post(
            '/api/auth/login/',
            {
                'method': 'email',
                'identifier': self.user.email,
                'password': self.password,
            },
            format='json',
        )

        self.assertEqual(
            login_response.status_code,
            status.HTTP_200_OK,
        )

        access_token = login_response.data['access']
        refresh_token = login_response.data['refresh']

        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {access_token}',
        )

        response = self.client.post(
            '/accounts/logout/',
            {'refresh': refresh_token},
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_205_RESET_CONTENT,
        )


class RegistrationAndVerificationTests(APITestCase):
    """
    تست‌های ثبت‌نام، ارسال کد و تأیید ایمیل.
    """

    def setUp(self):
        self.registration_data = {
            'username': 'newtestuser',
            'email': 'newtest@example.com',
            'phone': '+491234567891',
            'password': 'Strong-Registration-Password_2026!',
        }

    def register_test_user(self):
        return self.client.post(
            '/api/auth/signup/',
            self.registration_data,
            format='json',
        )

    def get_code_from_latest_email(self):
        """
        کد شش‌رقمی را از ایمیل آزمایشی استخراج می‌کند.
        """
        self.assertTrue(
            mail.outbox,
            'No verification email was generated.',
        )

        email_body = mail.outbox[-1].body

        match = re.search(
            r'code is:\s*(\d{6})',
            email_body,
        )

        self.assertIsNotNone(
            match,
            'The verification code was not found in the email.',
        )

        return match.group(1)

    def test_signup_creates_inactive_user_and_sends_code(self):
        """
        ثبت‌نام باید کاربر غیرفعال بسازد و کد تأیید ارسال کند.
        """
        response = self.register_test_user()

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertIn('verificationId', response.data)

        user = User.objects.get(
            email__iexact=self.registration_data['email'],
        )

        self.assertFalse(user.is_active)

        self.assertEqual(
            user.profile.phone,
            self.registration_data['phone'],
        )

        verification = EmailVerification.objects.get(
            pk=response.data['verificationId'],
        )

        self.assertEqual(verification.user, user)
        self.assertFalse(verification.is_used)

        self.get_code_from_latest_email()

    def test_verification_activates_user(self):
        """
        کد صحیح باید حساب را فعال کند و ایمیل را تأیید کند.
        """
        signup_response = self.register_test_user()

        self.assertEqual(
            signup_response.status_code,
            status.HTTP_201_CREATED,
        )

        verification_id = signup_response.data['verificationId']
        code = self.get_code_from_latest_email()

        response = self.client.post(
            '/api/auth/verify-email/',
            {
                'email': self.registration_data['email'],
                'code': code,
                'verificationId': verification_id,
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        user = User.objects.get(
            email__iexact=self.registration_data['email'],
        )

        user.refresh_from_db()
        user.profile.refresh_from_db()

        self.assertTrue(user.is_active)
        self.assertTrue(user.profile.email_verified)

    def test_wrong_verification_code_does_not_activate_user(self):
        """
        کد اشتباه نباید حساب را فعال کند.
        """
        signup_response = self.register_test_user()

        self.assertEqual(
            signup_response.status_code,
            status.HTTP_201_CREATED,
        )

        response = self.client.post(
            '/api/auth/verify-email/',
            {
                'email': self.registration_data['email'],
                'code': '000000',
                'verificationId': signup_response.data[
                    'verificationId'
                ],
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        user = User.objects.get(
            email__iexact=self.registration_data['email'],
        )

        self.assertFalse(user.is_active)

    def test_resend_verification_creates_new_request(self):
        """
        ارسال مجدد باید شناسه جدید بسازد و درخواست قبلی را باطل کند.
        """
        signup_response = self.register_test_user()

        self.assertEqual(
            signup_response.status_code,
            status.HTTP_201_CREATED,
        )

        old_id = signup_response.data['verificationId']

        response = self.client.post(
            '/api/auth/resend-verification/',
            {
                'email': self.registration_data['email'],
                'verificationId': old_id,
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        new_id = response.data['verificationId']

        self.assertNotEqual(str(old_id), str(new_id))

        old_verification = EmailVerification.objects.get(
            pk=old_id,
        )

        self.assertTrue(old_verification.is_used)

        new_verification = EmailVerification.objects.get(
            pk=new_id,
        )

        self.assertFalse(new_verification.is_used)


class PasswordResetAPITests(APITestCase):
    """
    تست درخواست بازیابی رمز و تنظیم رمز جدید.
    """

    def setUp(self):
        self.old_password = 'Old-Strong-Password_2026!'
        self.new_password = 'New-Strong-Password_2027!'

        self.user = User.objects.create_user(
            username='resetuser',
            email='reset@example.com',
            password=self.old_password,
            is_active=True,
        )

        Profile.objects.get_or_create(user=self.user)

    def test_password_reset_changes_password(self):
        """
        لینک بازیابی معتبر باید امکان تغییر رمز را فراهم کند.
        """
        request_response = self.client.post(
            '/api/auth/forgot-password/',
            {'email': self.user.email},
            format='json',
        )

        self.assertEqual(
            request_response.status_code,
            status.HTTP_200_OK,
        )

        self.assertTrue(
            mail.outbox,
            'The password reset email was not generated.',
        )

        email_body = mail.outbox[-1].body

        match = re.search(
            r'https?://\S+',
            email_body,
        )

        self.assertIsNotNone(
            match,
            'The reset link was not found in the email.',
        )

        reset_url = match.group(0)
        parsed_url = urlparse(reset_url)
        query = parse_qs(parsed_url.query)

        uid = query.get('uid', [None])[0]
        token = query.get('token', [None])[0]

        self.assertIsNotNone(uid)
        self.assertIsNotNone(token)

        reset_response = self.client.post(
            '/api/auth/reset-password/',
            {
                'uid': uid,
                'token': token,
                'new_password': self.new_password,
                'confirm_password': self.new_password,
            },
            format='json',
        )

        self.assertEqual(
            reset_response.status_code,
            status.HTTP_200_OK,
        )

        self.user.refresh_from_db()

        self.assertTrue(
            self.user.check_password(self.new_password),
        )

        self.assertFalse(
            self.user.check_password(self.old_password),
        )




class RateLimitingTests(APITestCase):
    def test_password_reset_is_throttled_after_three_requests(self):
        payload = {
            'email': 'unknown@example.com',
        }

        url = '/api/auth/forgot-password/'

        # سه درخواست اول باید پاسخ عمومی موفق دریافت کنند.
        for _ in range(3):
            response = self.client.post(
                url,
                payload,
                format='json',
            )

            self.assertEqual(response.status_code, 200)

        # درخواست چهارم باید محدود شود.
        response = self.client.post(
            url,
            payload,
            format='json',
        )

        self.assertEqual(response.status_code, 429)
    def test_login_is_throttled_after_ten_requests(self):
        payload = {
            'method': 'email',
            'identifier': 'unknown@example.com',
            'password': 'Wrong-Password-2026!',
        }

        url = '/api/auth/login/'

        # ده درخواست اول به دلیل اطلاعات ورود نامعتبر رد می‌شوند.
        for _ in range(10):
            response = self.client.post(
                url,
                payload,
                format='json',
            )

            self.assertEqual(response.status_code, 401)

        # درخواست یازدهم باید به دلیل عبور از محدودیت رد شود.
        response = self.client.post(
            url,
            payload,
            format='json',
        )

        self.assertEqual(response.status_code, 429)
    def setUp(self):
        # جلوگیری از تأثیر درخواست‌های تست‌های قبلی
        cache.clear()

    def tearDown(self):
        # پاک‌کردن شمارنده‌ها پس از پایان تست
        cache.clear()

    def test_resend_verification_is_throttled_after_three_requests(self):
        payload = {
            'email': 'not-registered@example.com',
            'verificationId': (
                '123e4567-e89b-12d3-a456-426614174000'
            ),
        }

        url = '/api/auth/resend-verification/'

        # سه درخواست اول باید مجاز باشند.
        for _ in range(3):
            response = self.client.post(
                url,
                payload,
                format='json',
            )

            self.assertEqual(response.status_code, 200)

        # درخواست چهارم باید محدود شود.
        response = self.client.post(
            url,
            payload,
            format='json',
        )

        self.assertEqual(response.status_code, 429)