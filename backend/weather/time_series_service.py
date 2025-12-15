"""
Servicio de series temporales para datos meteorológicos.

Este módulo proporciona funciones para:
- Resampling y agregación de datos por hora/día
- Normalización de unidades
- Manejo de errores y validación
- Paginación de resultados grandes
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from django.db.models import QuerySet, Avg, Max, Min
from django.utils import timezone
import logging
from .models import City, WeatherObservation

logger = logging.getLogger(__name__)

# Mapeo de variables a campos del modelo
VARIABLE_FIELD_MAP = {
    'temp': 'temperature',
    'temperature': 'temperature',
    'humedad': 'humidity',
    'humidity': 'humidity',
    'viento': 'wind_speed',
    'wind': 'wind_speed',
    'wind_speed': 'wind_speed',
    'presión': 'pressure',
    'pressure': 'pressure',
}

# Unidades de variables (para documentación)
VARIABLE_UNITS = {
    'temperature': '°C',
    'humidity': '%',
    'wind_speed': 'km/h',
    'pressure': 'hPa',
}

# Rangos de tiempo disponibles (en horas)
TIME_RANGES = {
    'last_1h': 1,
    '1h': 1,
    'last_6h': 6,
    '6h': 6,
    'last_12h': 12,
    '12h': 12,
    'last_24h': 24,
    '24h': 24,
    '1d': 24,
    'last_48h': 48,
    '48h': 48,
    '2d': 48,
    '7d': 24 * 7,
    'last_7d': 24 * 7,
    '30d': 24 * 30,
    'last_30d': 24 * 30,
}

# Agregación (resampling) disponible
AGGREGATION_METHODS = {
    'hourly': 'hourly',
    'hour': 'hourly',
    'h': 'hourly',
    'daily': 'daily',
    'day': 'daily',
    'd': 'daily',
    'raw': 'raw',
}

# Límites de respuesta
MAX_RESPONSE_SIZE = 5000  # Máximo de puntos de datos por respuesta
PAGINATION_SIZE = 1000  # Tamaño de página para resultados grandes


class TimeSeriesValidationError(Exception):
    """Excepción para errores de validación de series temporales"""
    pass


def normalize_variable(variable: str) -> str:
    
    normalized = VARIABLE_FIELD_MAP.get(variable.lower())
    if normalized is None:
        valid_vars = ', '.join(set(VARIABLE_FIELD_MAP.values()))
        raise TimeSeriesValidationError(
            f"Variable '{variable}' no válida. Variables permitidas: {valid_vars}"
        )
    return normalized


def normalize_time_range(time_range: str) -> int:
    
    range_lower = time_range.lower()
    hours = TIME_RANGES.get(range_lower)
    
    if hours is None:
        valid_ranges = ', '.join(TIME_RANGES.keys())
        raise TimeSeriesValidationError(
            f"Rango de tiempo '{time_range}' no válido. "
            f"Rangos permitidos: {valid_ranges}"
        )
    return hours


def normalize_aggregation(aggregation: str) -> str:
    
    agg_lower = aggregation.lower()
    normalized = AGGREGATION_METHODS.get(agg_lower)
    
    if normalized is None:
        valid_agg = ', '.join(set(AGGREGATION_METHODS.values()))
        raise TimeSeriesValidationError(
            f"Agregación '{aggregation}' no válida. "
            f"Agregaciones permitidas: {valid_agg}"
        )
    return normalized


def validate_parameters(
    city_id: int,
    variable: str,
    time_range: str,
    aggregation: Optional[str] = None
) -> Tuple[int, str, int, str]:
    
    # Validar que la ciudad existe
    try:
        City.objects.get(id=city_id)
    except City.DoesNotExist:
        raise TimeSeriesValidationError(f"Ciudad con ID {city_id} no existe")
    
    # Normalizar variable
    normalized_variable = normalize_variable(variable)
    
    # Normalizar rango
    hours = normalize_time_range(time_range)
    
    # Normalizar agregación (por defecto: hourly si el rango >= 24h, sino 'raw')
    if aggregation is None:
        aggregation = 'hourly' if hours >= 24 else 'raw'
    else:
        aggregation = normalize_aggregation(aggregation)
    
    # Validar tamaño de respuesta esperada
    expected_points = hours if aggregation == 'raw' else (
        hours if aggregation == 'hourly' else hours // 24
    )
    
    if expected_points > MAX_RESPONSE_SIZE:
        raise TimeSeriesValidationError(
            f"Rango muy amplio. Máximo {MAX_RESPONSE_SIZE} puntos. "
            f"Rango solicitado generaría ~{expected_points} puntos."
        )
    
    return city_id, normalized_variable, hours, aggregation


def get_time_series_queryset(
    city_id: int,
    variable_field: str,
    hours: int
) -> QuerySet:
    
    end_time = timezone.now()
    start_time = end_time - timedelta(hours=hours)
    
    queryset = WeatherObservation.objects.filter(
        city_id=city_id,
        timestamp__gte=start_time,
        timestamp__lte=end_time
    ).order_by('timestamp').values('timestamp', variable_field)
    
    return queryset


def aggregate_data(
    queryset: QuerySet,
    variable_field: str,
    aggregation: str
) -> List[Dict[str, Any]]:
    
    if aggregation == 'raw':
        # Devolver datos sin agregar
        return [
            {
                'timestamp': obs['timestamp'],
                'value': obs[variable_field]
            }
            for obs in queryset
        ]
    
    # Convertir queryset a lista para procesamiento en memoria
    observations = list(queryset)
    
    if not observations:
        return []
    
    aggregated = []
    
    if aggregation == 'hourly':
        aggregated = _aggregate_hourly(observations, variable_field)
    elif aggregation == 'daily':
        aggregated = _aggregate_daily(observations, variable_field)
    
    return aggregated


def _aggregate_hourly(
    observations: List[Dict[str, Any]],
    variable_field: str
) -> List[Dict[str, Any]]:
    """Agrega observaciones por hora (promedio)."""
    hourly_buckets = {}
    
    for obs in observations:
        timestamp = obs['timestamp']
        # Agrupar por hora (redondear a hora completa)
        hour_key = timestamp.replace(minute=0, second=0, microsecond=0)
        
        if hour_key not in hourly_buckets:
            hourly_buckets[hour_key] = []
        
        value = obs[variable_field]
        if value is not None:
            hourly_buckets[hour_key].append(value)
    
    # Calcular promedio por hora
    result = []
    for hour_key in sorted(hourly_buckets.keys()):
        values = hourly_buckets[hour_key]
        avg_value = sum(values) / len(values)
        result.append({
            'timestamp': hour_key,
            'value': round(avg_value, 2)
        })
    
    return result


def _aggregate_daily(
    observations: List[Dict[str, Any]],
    variable_field: str
) -> List[Dict[str, Any]]:
    """Agrega observaciones por día (promedio)."""
    daily_buckets = {}
    
    for obs in observations:
        timestamp = obs['timestamp']
        # Agrupar por día (medianoche)
        day_key = timestamp.replace(hour=0, minute=0, second=0, microsecond=0)
        
        if day_key not in daily_buckets:
            daily_buckets[day_key] = []
        
        value = obs[variable_field]
        if value is not None:
            daily_buckets[day_key].append(value)
    
    # Calcular promedio por día
    result = []
    for day_key in sorted(daily_buckets.keys()):
        values = daily_buckets[day_key]
        avg_value = sum(values) / len(values)
        result.append({
            'timestamp': day_key,
            'value': round(avg_value, 2)
        })
    
    return result


def build_time_series(
    city_id: int,
    variable: str,
    time_range: str,
    aggregation: Optional[str] = None
) -> Dict[str, Any]:
    
    # Validar parámetros
    city_id, normalized_variable, hours, normalized_agg = validate_parameters(
        city_id, variable, time_range, aggregation
    )
    
    # Obtener ciudad
    city = City.objects.get(id=city_id)
    
    # Obtener datos
    queryset = get_time_series_queryset(city_id, normalized_variable, hours)
    
    if not queryset.exists():
        logger.warning(
            f"No data found for city_id={city_id}, "
            f"variable={normalized_variable}, hours={hours}"
        )
        return {
            'city_id': city_id,
            'city_name': city.name,
            'variable': variable,
            'variable_field': normalized_variable,
            'unit': VARIABLE_UNITS.get(normalized_variable, ''),
            'time_range': time_range,
            'aggregation': normalized_agg,
            'data': [],
            'metadata': {
                'total_points': 0,
                'start_time': None,
                'end_time': None,
                'has_data': False
            }
        }
    
    # Agregar datos
    aggregated_data = aggregate_data(queryset, normalized_variable, normalized_agg)
    
    # Construir respuesta
    start_time = aggregated_data[0]['timestamp'] if aggregated_data else None
    end_time = aggregated_data[-1]['timestamp'] if aggregated_data else None
    
    return {
        'city_id': city_id,
        'city_name': city.name,
        'variable': variable,
        'variable_field': normalized_variable,
        'unit': VARIABLE_UNITS.get(normalized_variable, ''),
        'time_range': time_range,
        'aggregation': normalized_agg,
        'data': aggregated_data,
        'metadata': {
            'total_points': len(aggregated_data),
            'start_time': start_time,
            'end_time': end_time,
            'has_data': len(aggregated_data) > 0
        }
    }
