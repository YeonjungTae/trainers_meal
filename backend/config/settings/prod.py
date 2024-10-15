import os

from .base import *

DEBUG = False

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = str(os.getenv('SECRET_KEY'))

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "trainer",
    "client",
    "order",
    "rest_framework",
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# CORS_ORIGIN_WHITELIST = ('http://3.37.154.71:8000', 'http://3.37.154.71:3000/', 'http://localhost:5173')
# CORS_ORIGIN_WHITELIST = ('*')
# CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = "config.urls"

# ALLOWED_HOSTS = ['15.165.56.1', 'localhost']
# CSRF_TRUSTED_ORIGINS = ['http://15.165.56.1:8000/', 'http://15.165.56.1:3000/']
ALLOWED_HOSTS = ['*']
CSRF_TRUSTED_ORIGINS = ['http://*']

SECURE_CROSS_ORIGIN_OPENER_POLICY=None
SESSION_COOKIE_SECURE=False

WSGI_APPLICATION = "config.wsgi.application"

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'lesik_server',
        'USER': 'lesik_db',
        'PASSWORD': '0607',
        'HOST': '127.0.0.1',
        'PORT': '5432'
    }
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, 'templates'), 
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
# Media files (Downloaded Files)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = 'media/'

SITE_ID = 1
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "http"
HOST_SCHEME = "http://"

# Internationalization
LANGUAGE_CODE = "ko"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_L10N = True
USE_TZ = False  # False로 설정해야 DB에 변경된 TIME_ZONE이 반영됨

#클릭재킹 방지설정 변경
X_FRAME_OPTIONS = 'SAMEORIGIN'