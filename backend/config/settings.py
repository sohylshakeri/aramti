from pathlib import Path
import os
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')


SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

DEBUG = os.getenv(
    'DJANGO_DEBUG',
    'False',
).lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        'DJANGO_ALLOWED_HOSTS',
        'localhost,127.0.0.1',
    ).split(',')
    if host.strip()
]

# Origins allowed to make CSRF-protected requests.
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'DJANGO_CSRF_TRUSTED_ORIGINS',
        '',
    ).split(',')
    if origin.strip()
]

# Security settings: development vs production.
def env_bool(name, default):
    return os.getenv(name, str(default)).strip().lower() in (
        'true',
        '1',
        'yes',
    )


SECURE_SSL_REDIRECT = env_bool(
    'DJANGO_SECURE_SSL_REDIRECT',
    not DEBUG,
)

SESSION_COOKIE_SECURE = env_bool(
    'DJANGO_SESSION_COOKIE_SECURE',
    not DEBUG,
)

CSRF_COOKIE_SECURE = env_bool(
    'DJANGO_CSRF_COOKIE_SECURE',
    not DEBUG,
)

# Enable HSTS only after HTTPS is correctly configured.
SECURE_HSTS_SECONDS = int(
    os.getenv('DJANGO_SECURE_HSTS_SECONDS', '0')
)

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #my app
    'accounts',
    'team',
    'services',
    'rest_framework',
    'portfolio',
    'contact',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'sitecontent',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
MEDIA_ROOT=BASE_DIR/'media'
MEDIA_URL='/media/'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        
        
    ),

    'DEFAULT_THROTTLE_RATES': {
        'signup': '5/hour',
        'login': '10/minute',
        'verify_email': '10/minute',
        'resend_verification': '3/hour',
        'password_reset': '3/hour',
        'password_reset_confirm': '10/hour',
        'testimonial_submission': '3/hour',
    },
}
# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origin.strip()
]

CORS_ALLOW_CREDENTIALS = True
EMAIL_BACKEND = os.getenv(
    'EMAIL_BACKEND',
    'django.core.mail.backends.console.EmailBackend',
)

EMAIL_HOST = os.getenv(
    'EMAIL_HOST',
    'localhost',
)

EMAIL_PORT = int(
    os.getenv('EMAIL_PORT', '25')
)

EMAIL_HOST_USER = os.getenv(
    'EMAIL_HOST_USER',
    '',
)

EMAIL_HOST_PASSWORD = os.getenv(
    'EMAIL_HOST_PASSWORD',
    '',
)

EMAIL_USE_TLS = os.getenv(
    'EMAIL_USE_TLS',
    'False',
).lower() in ('true', '1', 'yes')

EMAIL_USE_SSL = os.getenv(
    'EMAIL_USE_SSL',
    'False',
).lower() in ('true', '1', 'yes')

EMAIL_TIMEOUT = int(
    os.getenv('EMAIL_TIMEOUT', '20')
)

DEFAULT_FROM_EMAIL = os.getenv(
    'DEFAULT_FROM_EMAIL',
    'noreply@example.com',
)

FRONTEND_BASE_URL = os.getenv(
    'FRONTEND_BASE_URL',
    'http://localhost:5173',
)