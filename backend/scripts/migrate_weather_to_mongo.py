"""Migrate City and WeatherObservation models from Django ORM (SQLite) to MongoEngine documents in MongoDB.

Run with:
  python backend/scripts/migrate_weather_to_mongo.py --limit 1000
"""
import os
import django
import argparse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from weather.documents import CityDocument, WeatherObservationDocument
from config.mongo_config import init_mongo


def migrate(limit=None):
    init_mongo()

    # Attempt to detect Django ORM source tables; if absent, skip migration.
    try:
        from django.db import connection
        tables = connection.introspection.table_names()
    except Exception:
        tables = []

    if 'weather_city' not in tables:
        print('No weather_city table found in the relational DB; skipping weather migration.', flush=True)
        return

    print('Migrating cities...', flush=True)
    cities_created = 0
    for c in City.objects.all():
        try:
            CityDocument(
                id=c.id,
                name=c.name,
                latitud=c.latitud,
                longitud=c.longitud,
                altitud=c.altitud,
                comunidad_autonoma=c.comunidad_autonoma,
            ).save()
            cities_created += 1
        except Exception as e:
            print(f'Failed saving city id={getattr(c, "id", "?")}: {e}', flush=True)
    print(f'Cities migrated: {cities_created}', flush=True)

    qs = WeatherObservation.objects.order_by('timestamp')
    if limit:
        qs = qs[:limit]

    print('Migrating weather observations...', flush=True)
    processed = 0
    created = 0
    skipped = 0
    for w in qs:
        processed += 1
        try:
            WeatherObservationDocument(
                city_id=w.city.id,
                timestamp=w.timestamp,
                updated_at=getattr(w, 'updated_at', None),
                temperature=getattr(w, 'temperature', None),
                max_temperature=getattr(w, 'max_temperature', None),
                min_temperature=getattr(w, 'min_temperature', None),
                humidity=getattr(w, 'humidity', None),
                pressure=getattr(w, 'pressure', None),
                wind_speed=getattr(w, 'wind_speed', None),
                wind_direction=getattr(w, 'wind_direction', None),
                wind_gust=getattr(w, 'wind_gust', None),
                precipitation=getattr(w, 'precipitation', None),
                visibility=getattr(w, 'visibility', None),
                cloud_cover=getattr(w, 'cloud_cover', None),
                wind_chill=getattr(w, 'wind_chill', None),
                dew_point=getattr(w, 'dew_point', None),
                heat_index=getattr(w, 'heat_index', None),
            ).save()
            created += 1
        except Exception as e:
            skipped += 1
            print(f'Failed saving weather observation id={getattr(w, "id", "?")}: {e}', flush=True)

        if processed % 1000 == 0:
            print(f'Processed {processed} (created={created} skipped={skipped})', flush=True)

    print(f'Weather migration complete. Processed={processed} created={created} skipped={skipped}', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=None)
    args = parser.parse_args()
    migrate(limit=args.limit)
