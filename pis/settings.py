"""
Django settings for PhenoImageShare project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# TODO: Check deployment checklist in production - https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '$@lcu)5i$m8wjqfxoo2$jf)_29_8=*$q)akyp%&bpwf4_z0&@&'

#TODO: Turn off DEBUG in production.
DEBUG = True

TEMPLATE_DEBUG = True

# TODO: Turn off template directory setting: Use Template Loaders for a cleaner solution.
TEMPLATE_DIRS = [os.path.join(BASE_DIR, 'templates')]

ALLOWED_HOSTS = []

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.eggs.Loader',
)

# Application definition; contains session & static files management, admin, authentication, query, etc at the moment.

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'queries',
    'documentation',
    #'annotation'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'pis.urls'

WSGI_APPLICATION = 'pis.wsgi.application'


# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'auth_db',
	    'USER': 'sadebayo',
	    'PASSWORD': 'sadebayo',
	    'HOST': 'localhost'
    },
}

# Internationalization Options [US English Enabled]
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Location of static files (CSS, JavaScript, Images) for PhIS

STATIC_URL = '/phis/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

IQS = {
    'URL':{
        'HWU': 'http://lxbisel.macs.hw.ac.uk:8080/IQS/',
        'EBI': 'http://beta.phenoimageshare.org/data/iqs/',
    },    
    'ACP':{
        'getimages':{
            'name': 'getimages',
            'options':{
                'phenotype':'phenotype','anatomy':'anatomy','gene':'gene','term':'term'
            }
        },
        'getrois':{
            'name': 'getrois',
            'options':{
                'phenotype':'phenotype','anatomy':'anatomy','gene':'gene','term':'term'
            }
        }
    },
}