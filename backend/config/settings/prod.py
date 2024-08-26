import os

from .base import *

DEBUG = False

CORS_ORIGIN_WHITELIST = ('http://3.38.93.132:5173', 'http://localhost:5173')
CORS_ALLOW_CREDENTIALS = True

ALLOWED_HOSTS = ['3.38.93.132', 'localhost']
CSRF_TRUSTED_ORIGINS = ['http://3.38.93.132:8000/']

# Database
DATABASES = {
    'default': {
        'ENGINE': os.environ.get('SQL_ENGINE'),
        'NAME': os.environ.get('SQL_DB_NAME'),
        'USER': os.environ.get('SQL_USERNAME'),
        'PASSWORD': os.environ.get('SQL_PASSWORD'),
        'HOST': os.environ.get('SQL_HOST'),
        'PORT': os.environ.get('SQL_PORT'),
    }
}

