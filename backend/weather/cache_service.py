"""
Servicio de caché para datos meteorológicos.

Este módulo proporciona funciones para gestionar el caché de datos meteorológicos,
incluyendo obtener, establecer e invalidar entradas en caché.

El caché está configurado con un timeout de 1 hora por defecto.
"""

from django.core.cache import cache
from django.conf import settings
from typing import Optional, Dict, Any
import json
# import hashlib


def get_cache_key(city_id: int, key_type: str = "current") -> str:
   
    prefix = settings.WEATHER_CACHE_KEY_PREFIX
    return f"{prefix}{key_type}_{city_id}"


def get_cached_weather(city_id: int) -> Optional[Dict[str, Any]]:
    
    cache_key = get_cache_key(city_id, "current")
    cached_data = cache.get(cache_key)
    return cached_data


def set_cached_weather(city_id: int, data: Dict[str, Any], timeout: Optional[int] = None) -> None:
    
    cache_key = get_cache_key(city_id, "current")
    cache_timeout = timeout or settings.WEATHER_CACHE_TIMEOUT
    cache.set(cache_key, data, cache_timeout)


def invalidate_weather_cache(city_id: int) -> None:
    
    cache_key = get_cache_key(city_id, "current")
    cache.delete(cache_key)


def invalidate_all_weather_cache() -> None:
    
    cache.clear()


def get_cached_forecast(city_id: int, periods: int) -> Optional[Dict[str, Any]]:
    
    cache_key = get_cache_key(city_id, f"forecast_{periods}")
    cached_data = cache.get(cache_key)
    return cached_data


def set_cached_forecast(city_id: int, periods: int, data: Dict[str, Any], timeout: Optional[int] = None) -> None:
    
    cache_key = get_cache_key(city_id, f"forecast_{periods}")
    cache_timeout = timeout or settings.WEATHER_CACHE_TIMEOUT
    cache.set(cache_key, data, cache_timeout)


def invalidate_forecast_cache(city_id: int, periods: Optional[int] = None) -> None:
    
    if periods is None:
        # Invalidar todas las predicciones de esta ciudad (no es exacto pero funciona)
        # En producción, considerar mantener un índice de claves
        cache_key = get_cache_key(city_id, f"forecast_")
        # Aquí no podemos hacer un wildcard delete fácilmente con locmem
        # Por eso invalidamos manualmente los tamaños más comunes
        for p in [6, 12, 24, 48, 72]:
            cache.delete(get_cache_key(city_id, f"forecast_{p}"))
    else:
        cache_key = get_cache_key(city_id, f"forecast_{periods}")
        cache.delete(cache_key)


def get_timeseries_cache_key(
    city_id: int,
    variable: str,
    time_range: str,
    aggregation: str = "raw"
) -> str:
    
    prefix = settings.WEATHER_CACHE_KEY_PREFIX
    return f"{prefix}timeseries_{city_id}_{variable}_{time_range}_{aggregation}"


def get_cached_timeseries(
    city_id: int,
    variable: str,
    time_range: str,
    aggregation: str = "raw"
) -> Optional[Dict[str, Any]]:
    
    cache_key = get_timeseries_cache_key(city_id, variable, time_range, aggregation)
    return cache.get(cache_key)


def set_cached_timeseries(
    city_id: int,
    variable: str,
    time_range: str,
    aggregation: str,
    data: Dict[str, Any],
    timeout: Optional[int] = None
) -> None:
    
    cache_key = get_timeseries_cache_key(city_id, variable, time_range, aggregation)
    cache_timeout = timeout or settings.WEATHER_CACHE_TIMEOUT
    cache.set(cache_key, data, cache_timeout)


def invalidate_timeseries_cache(city_id: int) -> None:
    
    # Invalidar todas las combinaciones comunes
    variables = ['temperature', 'humidity', 'wind_speed', 'pressure']
    time_ranges = ['last_1h', 'last_6h', 'last_24h', '7d', '30d']
    aggregations = ['raw', 'hourly', 'daily']
    
    for variable in variables:
        for time_range in time_ranges:
            for aggregation in aggregations:
                cache_key = get_timeseries_cache_key(
                    city_id, variable, time_range, aggregation
                )
                cache.delete(cache_key)


def get_cache_stats() -> Dict[str, Any]:
    
    try:
        stats = cache.get_stats()
        return stats
    except AttributeError:
        # Algunos backends de caché no soportan estadísticas
        return {"message": "Las estadísticas no están disponibles para este backend de caché"}
