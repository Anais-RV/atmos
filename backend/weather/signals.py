from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import WeatherObservation
from .cache_service import invalidate_weather_cache, invalidate_forecast_cache


@receiver(post_save, sender=WeatherObservation)
def invalidate_weather_cache_on_save(sender, instance, created, **kwargs):
    
    city_id = instance.city.id
    invalidate_weather_cache(city_id)
    # También invalidar las predicciones ya que los datos base han cambiado
    invalidate_forecast_cache(city_id)


@receiver(post_delete, sender=WeatherObservation)
def invalidate_weather_cache_on_delete(sender, instance, **kwargs):
    
    city_id = instance.city.id
    invalidate_weather_cache(city_id)
    invalidate_forecast_cache(city_id)
