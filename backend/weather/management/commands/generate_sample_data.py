"""
Comando para generar datos de muestra de series temporales.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from weather.models import City, WeatherObservation


class Command(BaseCommand):
    help = 'Genera datos de muestra de series temporales para pruebas'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Número de días de datos históricos a generar (default: 30)'
        )
        parser.add_argument(
            '--interval',
            type=int,
            default=1,
            help='Intervalo en horas entre mediciones (default: 1)'
        )

    def handle(self, *args, **options):
        days = options['days']
        interval_hours = options['interval']

        # Obtener todas las ciudades
        cities = City.objects.all()
        
        if not cities.exists():
            self.stdout.write(self.style.ERROR(
                'No hay ciudades en la base de datos. Ejecuta primero: python manage.py load_cities'
            ))
            return

        self.stdout.write(f'Generando datos para {cities.count()} ciudades...')
        self.stdout.write(f'Periodo: últimos {days} días, intervalo: {interval_hours} hora(s)')

        total_records = 0
        now = timezone.now()
        
        for city in cities:
            self.stdout.write(f'\nProcesando: {city.name}...')
            
            # Generar datos históricos
            current_time = now - timedelta(days=days)
            city_records = 0
            
            # Temperatura base para la ciudad (variará entre 5-25°C)
            base_temp = random.uniform(10, 20)
            
            while current_time <= now:
                # Generar datos con variación realista
                hour_of_day = current_time.hour
                
                # Variación diurna (más calor al mediodía)
                temp_variation = 5 * (1 - abs(hour_of_day - 14) / 14)
                temperature = base_temp + temp_variation + random.uniform(-2, 2)
                
                # Humedad inversa a temperatura
                humidity = 70 - (temperature - 15) * 2 + random.uniform(-10, 10)
                humidity = max(20, min(95, humidity))
                
                # Presión atmosférica estable con pequeñas variaciones
                pressure = 1013 + random.uniform(-20, 20)
                
                # Velocidad del viento
                wind_speed = random.uniform(5, 25)
                wind_direction = random.uniform(0, 360)
                
                # Precipitación
                precipitation = random.uniform(0, 5) if random.random() > 0.7 else 0
                
                # Cobertura nubosa
                cloud_cover = random.uniform(0, 100)
                
                # Crear registro
                WeatherObservation.objects.create(
                    city=city,
                    timestamp=current_time,
                    temperature=round(temperature, 1),
                    humidity=round(humidity, 1),
                    pressure=round(pressure, 1),
                    wind_speed=round(wind_speed, 1),
                    wind_direction=round(wind_direction, 1),
                    precipitation=round(precipitation, 1),
                    cloud_cover=round(cloud_cover, 1)
                )
                
                city_records += 1
                current_time += timedelta(hours=interval_hours)
            
            total_records += city_records
            self.stdout.write(self.style.SUCCESS(
                f'  ✓ {city.name}: {city_records} registros creados'
            ))

        self.stdout.write(self.style.SUCCESS(
            f'\n✓ Completado. Total de registros creados: {total_records}'
        ))
