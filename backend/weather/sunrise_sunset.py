"""
Módulo para calcular amanecer, atardecer y duración del día usando Astral
"""

from datetime import datetime, timedelta
from astral import LocationInfo
from astral.sun import sun
import pytz


def calculate_sunrise_sunset(latitude, longitude, city_name, observation_date=None):
    """
    Calcula el amanecer, atardecer y duración del día para una ubicación.
    
    Args:
        latitude (float): Latitud de la ubicación
        longitude (float): Longitud de la ubicación
        city_name (str): Nombre de la ciudad
        observation_date (datetime): Fecha para calcular (por defecto: hoy)
    
    Returns:
        dict: Diccionario con sunrise, sunset, daylight_duration (en segundos)
    """
    if observation_date is None:
        observation_date = datetime.now(pytz.UTC)
    
    # Asegurar que la fecha está en UTC
    if observation_date.tzinfo is None:
        observation_date = pytz.UTC.localize(observation_date)
    
    # Crear información de localización
    location = LocationInfo(city_name, region="", timezone="UTC", latitude=latitude, longitude=longitude)
    
    # Calcular sunrise y sunset
    sun_times = sun(location.observer, date=observation_date.date())
    
    sunrise = sun_times['sunrise']
    sunset = sun_times['sunset']
    
    # Calcular duración del día en segundos
    daylight_duration = (sunset - sunrise).total_seconds()
    
    return {
        'sunrise': sunrise,
        'sunset': sunset,
        'daylight_duration': daylight_duration
    }


def format_time_12h(dt):
    """
    Formatea un datetime a formato 12h (HH:MM AM/PM)
    
    Args:
        dt (datetime): Datetime a formatear
    
    Returns:
        str: Hora formateada en 12h
    """
    if dt is None:
        return None
    return dt.strftime('%I:%M %p')


def format_time_24h(dt):
    """
    Formatea un datetime a formato 24h (HH:MM)
    
    Args:
        dt (datetime): Datetime a formatear
    
    Returns:
        str: Hora formateada en 24h
    """
    if dt is None:
        return None
    return dt.strftime('%H:%M')


def format_daylight_duration(seconds):
    """
    Formatea la duración del día en formato legible (HH:MM:SS)
    
    Args:
        seconds (float): Duración en segundos
    
    Returns:
        str: Duración formateada
    """
    if seconds is None:
        return None
    
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"
