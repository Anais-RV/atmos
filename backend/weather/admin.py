from django.contrib import admin
from .models import WeatherObservation, City

# Register your models here.
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    # Columnas visibles
    list_display = ['name', 'latitud', 'longitud', 'altitud']
    

@admin.register(WeatherObservation)
class WeatherObservationAdmin(admin.ModelAdmin):
    # Columans visibles
    list_display = [
        'temperature', 
        'max_temperature',
        'min_temperature',
        'humidity',
        'pressure',
        'wind_speed',
        'wind_direction',
        'wind_gust',
        'precipitation',
        'visibility',
        'cloud_cover',
        'wind_chill',
        'dew_point',
        'heat_index'
    ]