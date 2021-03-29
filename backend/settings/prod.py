from .base import *

DEBUG = False
ALLOWED_HOSTS = [
    "222.122.232.80",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "database" / "db.sqlite3",
    }
}
