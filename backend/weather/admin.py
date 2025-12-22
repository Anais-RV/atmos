from django.contrib import admin

# If Django ORM models are present, register them with the admin for
# backwards compatibility during migration. MongoEngine documents are
# not compatible with Django admin and therefore are not registered.
try:
    from .models import WeatherObservation, City  # Django ORM models
    _DJANGO_ORM_AVAILABLE = True
except Exception:
    WeatherObservation = None
    City = None
    _DJANGO_ORM_AVAILABLE = False

if _DJANGO_ORM_AVAILABLE:
    @admin.register(City)
    class CityAdmin(admin.ModelAdmin):
        list_display = ['name', 'latitud', 'longitud', 'altitud']


    @admin.register(WeatherObservation)
    class WeatherObservationAdmin(admin.ModelAdmin):
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
else:
    # Intentionally no admin registration for MongoEngine documents.
    pass