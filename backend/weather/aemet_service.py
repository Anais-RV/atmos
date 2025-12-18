"""
Servicio para obtener datos meteorológicos de AEMET OpenData API.

API oficial de la Agencia Estatal de Meteorología de España.
Requiere API key gratuita: https://opendata.aemet.es/centrodedescargas/inicio

Documentación: https://opendata.aemet.es/dist/index.html

TODO para estudiantes:
1. Registrarse en AEMET OpenData y obtener API key
2. Configurar AEMET_API_KEY en settings.py o variables de entorno
3. Implementar endpoints adicionales (predicción, observaciones históricas)
4. Mejorar manejo de errores y reintentos
5. Añadir más campos meteorológicos (viento, presión, etc.)
"""

import requests
from django.conf import settings
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# API key de AEMET (obtener en https://opendata.aemet.es)
AEMET_API_KEY = getattr(settings, 'AEMET_API_KEY', None)
AEMET_BASE_URL = "https://opendata.aemet.es/opendata/api"


def get_aemet_data_by_coordinates(latitude, longitude):
    """
    Obtiene datos meteorológicos actuales para unas coordenadas.
    
    AEMET trabaja con estaciones meteorológicas, no coordenadas directas.
    Esta función busca la estación más cercana a las coordenadas dadas.
    
    Args:
        latitude (float): Latitud de la ubicación
        longitude (float): Longitud de la ubicación
    
    Returns:
        dict: Datos meteorológicos con temperatura, humedad, etc.
              None si no hay API key o hay error
    
    TODO: Implementar búsqueda de estación más cercana
    """
    if not AEMET_API_KEY:
        logger.warning("AEMET_API_KEY no configurada. Usando datos mock.")
        return None
    
    # TODO: Implementar llamada real a AEMET
    # Endpoint sugerido: /api/observacion/convencional/todas
    # Filtrar por distancia a las coordenadas
    
    return None


def get_mock_weather_data(city_name="Madrid"):
    """
    Datos meteorológicos de prueba mientras no hay API key configurada.
    
    Devuelve datos realistas para demostración.
    Los estudiantes deben reemplazar esto con datos reales de AEMET.
    
    Args:
        city_name (str): Nombre de la ciudad (para logging)
    
    Returns:
        dict: Datos meteorológicos simulados
    """
    import random
    from datetime import datetime
    import pytz
    
    # Temperaturas típicas de diciembre en España
    base_temps = {
        'Madrid': 8,
        'Barcelona': 12,
        'Valencia': 14,
        'Sevilla': 13,
        'Bilbao': 10,
        'Zaragoza': 7,
        'Málaga': 15,
    }
    
    base_temp = base_temps.get(city_name, 10)
    # Variación aleatoria ±3 grados
    temperature = base_temp + random.uniform(-3, 3)
    
    return {
        'temperature': round(temperature, 1),
        'humidity': random.randint(50, 80),
        'pressure': random.randint(1010, 1025),
        'wind_speed': round(random.uniform(0, 15), 1),
        'condition': random.choice(['Despejado', 'Parcialmente nublado', 'Nublado', 'Lluvia ligera']),
        'timestamp': datetime.now(pytz.UTC),
        'source': 'mock_data'
    }


def fetch_current_weather(city_name, latitude, longitude):
    """
    Obtiene el clima actual para una ciudad.
    
    Intenta obtener datos de AEMET si hay API key.
    Si no, devuelve datos mock para demostración.
    
    Args:
        city_name (str): Nombre de la ciudad
        latitude (float): Latitud
        longitude (float): Longitud
    
    Returns:
        dict: Datos meteorológicos actuales
    
    Ejemplo de respuesta:
        {
            'temperature': 12.5,
            'humidity': 65,
            'pressure': 1015,
            'wind_speed': 8.3,
            'condition': 'Parcialmente nublado',
            'timestamp': datetime,
            'source': 'aemet' o 'mock_data'
        }
    """
    
    # Intentar obtener datos reales de AEMET
    if AEMET_API_KEY:
        aemet_data = get_aemet_data_by_coordinates(latitude, longitude)
        if aemet_data:
            return aemet_data
    
    # Si no hay API key o falla, usar datos mock
    logger.info(f"Usando datos mock para {city_name} (sin API key de AEMET)")
    return get_mock_weather_data(city_name)
