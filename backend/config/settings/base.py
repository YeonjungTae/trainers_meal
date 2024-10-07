import os
from pathlib import Path
from datetime import timedelta

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
    "lesik_admin",
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

CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = "config.urls"

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

WSGI_APPLICATION = "config.wsgi.application"

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static', 'common'), 
]

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Media files (Downloaded Files)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
LANGUAGE_CODE = "ko"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_L10N = True
USE_TZ = False  # False로 설정해야 DB에 변경된 TIME_ZONE이 반영됨

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SITE_ID = 1
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "http"
HOST_SCHEME = "http://"

#클릭재킹 방지설정 변경
X_FRAME_OPTIONS = 'SAMEORIGIN'

SESSION_ENGINE = "django.contrib.sessions.backends.cache"

# LOGIN_REDIRECT_URL = 'mail/'
# LOGIN_URL = '/'
# LOGOUT_REDIRECT_URL	= 'logout/'
# CSRF_FAILURE_VIEW = 'common.views.csrf_failure'

#Cookie name. this can be whatever you want
# SESSION_COOKIE_NAME='sessionid'  # use the sessionid in your views code
# #the module to store sessions data
# SESSION_ENGINE='django.contrib.sessions.backends.db'    
# #age of cookie in seconds (default: 2 weeks)
# SESSION_COOKIE_AGE= 24*60*60*7 # the number of seconds for only 7 for example
# #whether a user's session cookie expires when the web browser is closed
# SESSION_EXPIRE_AT_BROWSER_CLOSE=False
# #whether the session cookie should be secure (https:// only)
# SESSION_COOKIE_SECURE=False
