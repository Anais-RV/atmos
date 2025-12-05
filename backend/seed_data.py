from weather.models import City, WeatherObservation
from datetime import datetime

# Crear ciudades
cities_data = [
    (1, 'Madrid'),
    (2, 'Barcelona'),
    (3, 'Valencia'),
    (4, 'Sevilla'),
    (5, 'Bilbao'),
]

for city_id, city_name in cities_data:
    city, created = City.objects.get_or_create(id=city_id, defaults={'name': city_name})
    if created:
        print(f'Ciudad creada: {city_name}')
    else:
        print(f'Ciudad existente: {city_name}')
    
    # Crear observación meteorológica
    obs, created = WeatherObservation.objects.get_or_create(
        city=city,
        defaults={
            'temperature': 18.5,
            'timestamp': datetime.now()
        }
    )
    if created:
        print(f'  → Observación creada para {city_name}')

print('\n✓ Datos de ejemplo creados correctamente')
