"""Seed script for local development.

Initializes Django and Mongo (if used) and inserts a small set of
example cities and a recent weather observation for each.
"""

import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Try to initialize MongoDB, with fallback to mongomock on SSL error
try:
    from config.mongo_config import init_mongo
    init_mongo()
except Exception as e:
    import warnings
    error_msg = str(e).lower()
    if 'ssl' in error_msg or 'handshake' in error_msg or 'tls' in error_msg:
        # SSL error - use mongomock fallback
        warnings.warn(f'⚠️  MongoDB SSL error. Using mongomock fallback: {str(e)[:100]}')
        try:
            import mongomock
            import mongoengine
            mongoengine.disconnect()  # Disconnect first
            mongoengine.connect(
                db='atmos_db',
                host='mongodb://localhost:27017',
                mongo_client_class=mongomock.MongoClient
            )
            warnings.warn('✅ mongomock initialized as fallback')
        except Exception as e_mock:
            raise RuntimeError(f"Both MongoDB and mongomock failed: {e_mock}")
    else:
        raise

# Import mongoengine documents (mongo-only seed)
from weather.documents import CityDocument, WeatherObservationDocument
use_mongo = True

# Crear ciudades
cities_data = [
    (1, 'Madrid'),
    (2, 'Barcelona'),
    (3, 'Valencia'),
    (4, 'Sevilla'),
    (5, 'Bilbao'),
]

for city_id, city_name in cities_data:
    if use_mongo:
        try:
            city = CityDocument.objects(id=city_id).first()
        except Exception as e:
            # Another SSL error during query - try mongomock reconnect
            error_msg = str(e).lower()
            if 'ssl' in error_msg or 'handshake' in error_msg or 'tls' in error_msg:
                import warnings
                warnings.warn(f'⚠️  SSL error during query. Retrying with mongomock: {str(e)[:100]}')
                try:
                    import mongomock
                    import mongoengine
                    mongoengine.disconnect()  # Disconnect first
                    mongoengine.connect(
                        db='atmos_db',
                        host='mongodb://localhost:27017',
                        mongo_client_class=mongomock.MongoClient
                    )
                    city = CityDocument.objects(id=city_id).first()
                except Exception as e_retry:
                    raise RuntimeError(f"Failed even with mongomock: {e_retry}")
            else:
                raise
        
        created = False
        if not city:
            city = CityDocument(id=city_id, name=city_name)
            city.save()
            created = True

        if created:
            print(f'Ciudad creada: {city_name}')
        else:
            print(f'Ciudad existente: {city_name}')

        # Crear observación meteorológica
        obs = WeatherObservationDocument.objects(
            city_id=city_id,
            timestamp__gte=timezone.now() - timedelta(minutes=1)
        ).first()

        if not obs:
            obs = WeatherObservationDocument(
                city_id=city_id,
                temperature=18.5,
                timestamp=timezone.now()
            )
            obs.save()
            print(f'  -> Observación creada para {city_name}')
    else:
        city = CityModel.objects.filter(id=city_id).first()
        created = False
        if not city:
            city = CityModel(id=city_id, name=city_name)
            city.save()
            created = True

        if created:
            print(f'Ciudad creada (ORM): {city_name}')
        else:
            print(f'Ciudad existente (ORM): {city_name}')

        obs = WeatherObservationModel.objects.filter(
            city_id=city_id,
            timestamp__gte=timezone.now() - timedelta(minutes=1)
        ).first()

        if not obs:
            obs = WeatherObservationModel(
                city_id=city_id,
                temperature=18.5,
                timestamp=timezone.now()
            )
            obs.save()
            print(f'  -> Observación creada para {city_name} (ORM)')

print('\n✓ Datos de ejemplo creados correctamente')
