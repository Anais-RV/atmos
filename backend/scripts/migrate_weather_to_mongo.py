"""Migrate City and WeatherObservation models from Django ORM (SQLite) to MongoEngine documents in MongoDB.

Run with:
  python backend/scripts/migrate_weather_to_mongo.py --limit 1000
"""
import os
import django
import argparse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from weather.models import City, WeatherObservation
from weather.documents import CityDocument, WeatherObservationDocument
from config.mongo_config import init_mongo


def migrate(limit=None):
    init_mongo()

    # Cities
    for c in City.objects.all():
        CityDocument(
            id=c.id,
            name=c.name,
            latitud=c.latitud,
            longitud=c.longitud,
            altitud=c.altitud,
            comunidad_autonoma=c.comunidad_autonoma,
        ).save()

    qs = WeatherObservation.objects.order_by('timestamp')
    if limit:
        qs = qs[:limit]

    for w in qs:
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

    print('Weather migration complete')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=None)
    args = parser.parse_args()
    migrate(limit=args.limit)
