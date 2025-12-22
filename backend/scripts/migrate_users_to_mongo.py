"""Migrate Django `users` table from SQLite (Django ORM) to MongoDB via MongoEngine.

Run with:
  python backend/scripts/migrate_users_to_mongo.py

Requires `MONGODB_URI` configured and `config.mongo_config.init_mongo()` connection accessible via mongoengine.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User  # Django ORM model
from users.documents import UserDocument, UserPreferencesDocument, TagDocument
from config.mongo_config import init_mongo
from decouple import config

def migrate():
    init_mongo()
    qs = User.objects.all()
    total = qs.count()
    print(f'Migrating {total} users to MongoDB')
    for u in qs:
        prefs = None
        try:
            up = getattr(u, 'userpreferences', None)
            if up:
                prefs = UserPreferencesDocument(
                    theme=getattr(up, 'theme', 'light'),
                    language=getattr(up, 'language', 'es'),
                    favourite_weather_station=getattr(up, 'favourite_weather_station', None)
                )
        except Exception:
            prefs = None

        user_doc = UserDocument(
            id=u.id,
            username=u.username,
            email=u.email,
            password=u.password,
            is_active=u.is_active,
            is_staff=u.is_staff,
            is_superuser=u.is_superuser,
            preferences=prefs,
            date_joined=u.date_joined,
        )
        user_doc.save()
    print('Users migration complete')

if __name__ == '__main__':
    migrate()
