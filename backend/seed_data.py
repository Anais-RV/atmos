from weather.documents import CityDocument, WeatherObservationDocument
from datetime import datetime, timedelta

# Crear ciudades
cities_data = [
    (1, 'Madrid'),
    (2, 'Barcelona'),
    (3, 'Valencia'),
    (4, 'Sevilla'),
    (5, 'Bilbao'),
]

for city_id, city_name in cities_data:
    city = CityDocument.objects(id=city_id).first()
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
        timestamp__gte=datetime.utcnow() - timedelta(minutes=1)
    ).first()

    if not obs:
        obs = WeatherObservationDocument(
            city_id=city_id,
            temperature=18.5,
            timestamp=datetime.utcnow()
        )
        obs.save()
        print(f'  → Observación creada para {city_name}')

print('\n✓ Datos de ejemplo creados correctamente')
