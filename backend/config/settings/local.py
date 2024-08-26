import os

from .base import *

DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# Database
DATABASES = {
    'default': {
        'ENGINE': str(os.getenv('LOCAL_SQL_ENGINE')),
        'NAME': str(os.getenv('LOCAL_SQL_DB_NAME')),
        'USER': str(os.getenv('LOCAL_SQL_USERNAME')),
        'PASSWORD': str(os.getenv('LOCAL_SQL_PASSWORD')),
        'HOST': str(os.getenv('LOCAL_SQL_HOST')),
        'PORT': str(os.getenv('LOCAL_SQL_PORT'))
    }
}