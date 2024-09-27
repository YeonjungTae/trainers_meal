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

# CORS_ORIGIN_WHITELIST = ('http://15.165.56.1:8000', 'http://15.165.56.1:3000', 'http://localhost:5173')
# CORS_ORIGIN_WHITELIST = ('*')
# CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = "config.urls"

# ALLOWED_HOSTS = ['15.165.56.1', 'localhost']
# CSRF_TRUSTED_ORIGINS = ['http://15.165.56.1:8000/', 'http://15.165.56.1:3000/']
ALLOWED_HOSTS = ['*']
CSRF_TRUSTED_ORIGINS = ['http://*']

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

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
# Media files (Downloaded Files)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

SITE_ID = 1
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "http"
HOST_SCHEME = "http://"