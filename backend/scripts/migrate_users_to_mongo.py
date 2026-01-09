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
    print(f'Migrating {total} users to MongoDB', flush=True)
    created = 0
    skipped = 0
    i = 0
    for u in qs:
        i += 1
        prefs = None
        try:
            up = getattr(u, 'userpreferences', None)
            if up:
                prefs = UserPreferencesDocument(
                    theme=getattr(up, 'theme', 'light'),
                    language=getattr(up, 'language', 'es'),
                    favourite_weather_station=getattr(up, 'favourite_weather_station', None)
                )
        except Exception as e:
            prefs = None
            print(f'Warning building preferences for user {getattr(u, "id", "?")}: {e}', flush=True)

        try:
            # Ensure email is valid for MongoEngine EmailField; if missing, set placeholder
            email_val = getattr(u, 'email', None)
            if not email_val:
                email_val = f'user{getattr(u, "id", "")}@no-email.local'
        except Exception:
            email_val = f'user{getattr(u, "id", "")}@no-email.local'

        try:
            user_doc = UserDocument(
                id=u.id,
                username=u.username,
                email=email_val,
                password=u.password,
                is_active=u.is_active,
                is_staff=u.is_staff,
                is_superuser=u.is_superuser,
                preferences=prefs,
                date_joined=u.date_joined,
            )
            user_doc.save()
            created += 1
        except Exception as e:
            skipped += 1
            print(f'Failed saving user id={getattr(u, "id", "?")}: {e}', flush=True)

        if i % 100 == 0:
            print(f'Processed {i}/{total} users (created={created} skipped={skipped})', flush=True)

    print(f'Users migration complete. Processed={i} created={created} skipped={skipped}', flush=True)

if __name__ == '__main__':
    migrate()
