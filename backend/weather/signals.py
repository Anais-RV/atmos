import logging
from django.db import transaction
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import WeatherObservation
from .cache_service import (
    invalidate_weather_cache,
    invalidate_forecast_cache,
)

logger = logging.getLogger(__name__)


def _invalidate_caches_for_city(city_id, operation="update"):
    
    try:
        invalidate_weather_cache(city_id)
        logger.info(f"✅ Weather cache invalidated for city {city_id} ({operation})")
    except Exception as e:
        logger.error(
            f"❌ Failed to invalidate weather cache for city {city_id}: {str(e)}",
            exc_info=True
        )
    
    try:
        invalidate_forecast_cache(city_id)
        logger.info(f"✅ Forecast cache invalidated for city {city_id} ({operation})")
    except Exception as e:
        logger.error(
            f"❌ Failed to invalidate forecast cache for city {city_id}: {str(e)}",
            exc_info=True
        )


@receiver(post_save, sender=WeatherObservation)
def invalidate_weather_cache_on_save(sender, instance, created, **kwargs):
    
    # Proteger contra city=None (borrado en cascada u otros edge cases)
    if instance.city is None:
        logger.warning(
            f"⚠️ WeatherObservation {instance.id} has no city, skipping cache invalidation"
        )
        return
    
    operation = "create" if created else "update"
    city_id = instance.city.id
    
    # Ejecutar invalidación DESPUÉS del commit de la transacción
    transaction.on_commit(
        lambda: _invalidate_caches_for_city(city_id, operation)
    )
    
    logger.debug(
        f"🔄 Scheduled cache invalidation for city {city_id} ({operation})"
    )


@receiver(post_delete, sender=WeatherObservation)
def invalidate_weather_cache_on_delete(sender, instance, **kwargs):
    
    # Proteger contra city=None
    if instance.city is None:
        logger.warning(
            f"⚠️ Deleted WeatherObservation {instance.id} has no city reference"
        )
        return
    
    city_id = instance.city.id
    
    # Ejecutar invalidación DESPUÉS del commit
    transaction.on_commit(
        lambda: _invalidate_caches_for_city(city_id, "delete")
    )
    
    logger.debug(f"🔄 Scheduled cache invalidation for city {city_id} (delete)")
