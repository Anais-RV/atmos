import logging
try:
    from mongoengine import signals as mongo_signals
    MONGOENGINE_AVAILABLE = True
except Exception:
    mongo_signals = None
    MONGOENGINE_AVAILABLE = False

# We no longer rely on Django ORM for weather observations; prefer MongoEngine documents.
WeatherObservation = None
DJANGO_ORM_AVAILABLE = False

from .documents import WeatherObservationDocument
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


def invalidate_weather_cache_on_save(sender, instance, created, **kwargs):
    # Proteger contra city=None (borrado en cascada u otros edge cases)
    try:
        city = getattr(instance, 'city', None)
        if city is None:
            logger.warning(
                f"⚠️ WeatherObservation {getattr(instance, 'id', 'unknown')} has no city, skipping cache invalidation"
            )
            return

        operation = "create" if created else "update"
        city_id = getattr(city, 'id', None)

        # Directly invalidate caches for MongoEngine-backed documents.
        _invalidate_caches_for_city(city_id, operation)
        logger.debug(f"🔄 Invalidated caches for city {city_id} ({operation})")
    except Exception:
        logger.exception('Error during ORM save signal handling')


def invalidate_weather_cache_on_delete(sender, instance, **kwargs):
    try:
        city = getattr(instance, 'city', None)
        if city is None:
            logger.warning(
                f"⚠️ Deleted WeatherObservation {getattr(instance, 'id', 'unknown')} has no city reference"
            )
            return

        city_id = getattr(city, 'id', None)
        _invalidate_caches_for_city(city_id, "delete")
        logger.debug(f"🔄 Invalidated caches for city {city_id} (delete)")
    except Exception:
        logger.exception('Error during ORM delete signal handling')


# MongoEngine signal handlers (for document changes)
if MONGOENGINE_AVAILABLE:
    def _mongo_invalidate(sender, document, **kwargs):
        try:
            city_id = getattr(document, 'city_id', None) or getattr(getattr(document, 'city', None), 'id', None)
            if city_id is None:
                logging.getLogger(__name__).warning('Mongo WeatherObservation has no city_id, skipping')
                return

            # Directly invalidate caches for mongoengine document changes
            _invalidate_caches_for_city(city_id, operation='mongo')
        except Exception:
            logging.getLogger(__name__).exception('Error handling mongoengine signal')

    # connect to post_save and post_delete for WeatherObservationDocument
    try:
        mongo_signals.post_save.connect(_mongo_invalidate, sender=WeatherObservationDocument)
        mongo_signals.post_delete.connect(_mongo_invalidate, sender=WeatherObservationDocument)
    except Exception:
        logging.getLogger(__name__).warning('Could not connect mongoengine signals for WeatherObservationDocument')

# We only connect to mongoengine signals; ORM signals are not used in Mongo-only backend.
