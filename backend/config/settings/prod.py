import os

from .base import *

DEBUG = True

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

CORS_ORIGIN_WHITELIST = ('http://15.165.56.1:8000, http://15.165.56.1:3000', 'http://localhost:5173')
CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = "config.urls"

ALLOWED_HOSTS = ['15.165.56.1', 'localhost']
CSRF_TRUSTED_ORIGINS = ['http://15.165.56.1:8000/, http://15.165.56.1:3000/']

WSGI_APPLICATION = "config.wsgi.application"

# Database
DATABASES = {
    'default': {
        'ENGINE': str(os.getenv('django.db.backends.postgresql')),
        'NAME': str(os.getenv('SQL_DB_NAME')),
        'USER': str(os.getenv('SQL_USERNAME')),
        'PASSWORD': str(os.getenv('SQL_PASSWORD')),
        'HOST': str(os.getenv('SQL_HOST')),
        'PORT': str(os.getenv('SQL_PORT'))
    }
}

# Media files (Downloaded Files)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

SITE_ID = 1
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "http"
HOST_SCHEME = "http://"