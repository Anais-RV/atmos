#!/usr/bin/env python
"""
Script para poblar la base de datos con datos de prueba de clima
Uso: python seed_weather_data.py
"""
import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.utils import timezone
from weather.models import City, WeatherObservation

# Limpiar datos existentes
print("🗑️ Eliminando datos existentes...")
WeatherObservation.objects.all().delete()
City.objects.all().delete()

# Crear ciudades
print("🏙️ Creando ciudades...")
cities_data = [
    {"name": "Madrid", "temp": 18.3, "condition": "Parcialmente nublado", "wind": 2.1, "humidity": 65},
    {"name": "Barcelona", "temp": 22.0, "condition": "Soleado", "wind": 4.5, "humidity": 55},
    {"name": "Valencia", "temp": 15.7, "condition": "Lluvia", "wind": 8.2, "humidity": 85},
    {"name": "Sevilla", "temp": 24.5, "condition": "Soleado", "wind": 1.8, "humidity": 48},
    {"name": "Bilbao", "temp": 12.1, "condition": "Nublado", "wind": 5.3, "humidity": 72},
]

cities = {}
now = timezone.now()

for data in cities_data:
    city_name = data.pop("name")
    city = City.objects.create(name=city_name)
    cities[city_name] = city
    
    # Crear observación de prueba
    WeatherObservation.objects.create(
        city=city,
        timestamp=now,
        temperature=data["temp"],
        condition=data["condition"],
        wind_speed=data["wind"],
        humidity=data["humidity"],
        pressure=1013.25,
        visibility=10.0,
        feels_like_temp=data["temp"] - 1,
        uv_index=3,
        dew_point=10.5,
    )
    
    # Crear una observación anterior para simular histórico
    WeatherObservation.objects.create(
        city=city,
        timestamp=now - timedelta(hours=1),
        temperature=data["temp"] - 1,
        condition=data["condition"],
        wind_speed=data["wind"] + 0.5,
        humidity=data["humidity"] + 5,
        pressure=1013.0,
        visibility=9.5,
        feels_like_temp=data["temp"] - 2,
        uv_index=2,
        dew_point=10.0,
    )
    
    print(f"  ✅ {city_name}: {data['temp']}°C - {data['condition']}")

print(f"\n✨ ¡Datos de prueba creados exitosamente!")
print(f"   Total ciudades: {len(cities)}")
print(f"   Total observaciones: {WeatherObservation.objects.count()}")
print("\nPrueba con:")
print("  curl 'http://localhost:8000/api/weather/current/?city_id=1'")
