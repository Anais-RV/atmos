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
    {"name": "Madrid", "temp": 18.3, "condition": "Parcialmente nublado"},
    {"name": "Barcelona", "temp": 22.0, "condition": "Soleado"},
    {"name": "Valencia", "temp": 15.7, "condition": "Lluvia"},
    {"name": "Sevilla", "temp": 24.5, "condition": "Soleado"},
    {"name": "Bilbao", "temp": 12.1, "condition": "Nublado"},
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
    )
    
    # Crear una observación anterior para simular histórico
    WeatherObservation.objects.create(
        city=city,
        timestamp=now - timedelta(hours=1),
        temperature=data["temp"] - 1,
        condition=data["condition"],
    )
    
    print(f"  ✅ {city_name}: {data['temp']}°C - {data['condition']}")

print(f"\n✨ ¡Datos de prueba creados exitosamente!")
print(f"   Total ciudades: {len(cities)}")
print(f"   Total observaciones: {WeatherObservation.objects.count()}")
print("\nPrueba con:")
print("  curl 'http://localhost:8000/api/weather/current/?city_id=1'")
