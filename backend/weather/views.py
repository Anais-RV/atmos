# backend/weather/views.py

from django.conf import settings
# get_object_or_404 not used for MongoEngine documents
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.pagination import PageNumberPagination

from .prophet_service import build_prophet_forecast
from .emblem_photos import select_emblem_photo
from .city_photos import select_city_photo
from .documents import CityDocument, WeatherObservationDocument
from .serializers import (
    CurrentWeatherSerializer,
    TimeSeriesInputSerializer,
    TimeSeriesResponseSerializer,
    CitySerializer,
)
from .cache_service import (
    get_cached_weather,
    set_cached_weather,
    get_cached_forecast,
    set_cached_forecast,
    get_cached_timeseries,
    set_cached_timeseries,
)
from .time_series_service import (
    build_time_series,
    TimeSeriesValidationError,
)
from .sunrise_sunset import calculate_sunrise_sunset, format_time_24h, format_daylight_duration
from .aemet_service import fetch_current_weather
import logging

logger = logging.getLogger(__name__)


class CurrentWeatherView(APIView):
    """
    Endpoint para obtener los datos del clima actual de una ciudad.
    
    GET /api/weather/current/?city_id=1
    
    Devuelve la observación más reciente de esa ciudad.
    Los datos se cachean por 1 hora para reducir consultas a la base de datos.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        city_id = request.query_params.get("city_id")

        if city_id is None:
            return Response(
                {"detail": "city_id es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            city_id = int(city_id)
        except ValueError:
            return Response(
                {"detail": "city_id debe ser un entero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Intentar obtener datos del caché
        cached_data = get_cached_weather(city_id)
        if cached_data is not None:
            return Response(cached_data, status=status.HTTP_200_OK)

        # Obtener la ciudad
        city = CityDocument.objects(id=city_id).first()
        if not city:
            return Response(
                {"detail": f"Ciudad con ID {city_id} no encontrada"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # Intentar obtener datos de AEMET (o mock data)
        weather_data = fetch_current_weather(
            city_name=city.name,
            latitude=city.latitud,
            longitude=city.longitud
        )
        
        # Si no hay datos meteorológicos disponibles
        if not weather_data:
            return Response(
                {
                    "detail": f"No hay datos meteorológicos para la ciudad '{city.name}'",
                    "city_id": city_id,
                    "city_name": city.name,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Calcular sunrise y sunset
        sun_data = calculate_sunrise_sunset(
            latitude=city.latitud,
            longitude=city.longitud,
            city_name=city.name,
            observation_date=weather_data['timestamp']
        )

        # Preparar datos y serializar
        data = {
            "city_id": city.id,
            "city_name": city.name,
            "temperature": weather_data['temperature'],
            "timestamp": weather_data['timestamp'],
            "condition": weather_data.get('condition', 'Parcialmente nublado'),
            "sunrise": sun_data['sunrise'],
            "sunset": sun_data['sunset'],
            "daylight_duration": sun_data['daylight_duration'],
            "sunrise_formatted": format_time_24h(sun_data['sunrise']),
            "sunset_formatted": format_time_24h(sun_data['sunset']),
            "daylight_duration_formatted": format_daylight_duration(sun_data['daylight_duration']),
        }
        
        serializer = CurrentWeatherSerializer(data)
        response_data = serializer.data
        
        # Almacenar en caché
        set_cached_weather(city_id, response_data)
        
        return Response(response_data, status=status.HTTP_200_OK)



class ProphetForecastView(APIView):
    """
    Endpoint para obtener predicciones del clima usando Prophet.
    
    GET /api/weather/forecast/?city_id=1&periods=24
    
    Los datos de predicción se cachean por 1 hora para evitar recálculos innecesarios.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        city_id = request.query_params.get("city_id")
        periods = request.query_params.get("periods", "24")

        if city_id is None:
            return Response(
                {"detail": "city_id es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            city_id = int(city_id)
            periods = int(periods)
        except ValueError:
            return Response(
                {"detail": "city_id y periods deben ser enteros"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Intentar obtener predicción del caché
        cached_forecast = get_cached_forecast(city_id, periods)
        if cached_forecast is not None:
            return Response(cached_forecast, status=status.HTTP_200_OK)

        # Construir predicción si no está en caché
        points = build_prophet_forecast(city_id=city_id, periods=periods)

        response_data = {
            "city_id": city_id,
            "periods": periods,
            "points": points,
        }
        
        # Almacenar en caché
        set_cached_forecast(city_id, periods, response_data)

        return Response(response_data, status=status.HTTP_200_OK)


class CurrentConditionsView(APIView):
    """
    Endpoint para devolver condiciones actuales + foto emblemática (clima)
    + foto de ciudad (según ciudad elegida) para el dashboard.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        city_id_param = request.query_params.get("city_id")
        city_name = request.query_params.get("city_name")

        city_id = None
        if city_id_param is not None:
            try:
                city_id = int(city_id_param)
            except ValueError:
                # Si no es entero, lo ignoramos y nos quedamos con city_name
                city_id = None

        # TODO: sustituir estos placeholders con datos reales
        # Por ahora, dejamos valores fijos para probar la lógica.
        condition = "clear"   # p.ej. "rain", "snow", "clouds", "clear"...
        temp_c = 18.0         # temperatura actual en ºC
        is_daytime = True     # True si es de día, False si es de noche

        # Foto emblemática según clima
        emblem = select_emblem_photo(condition, temp_c, is_daytime)
        emblem_base_url = getattr(
            settings,
            "EMBLEM_PHOTO_BASE_URL",
            "https://cdn.example.com/emblems/",
        )
        emblem_photo_url = emblem_base_url.rstrip("/") + "/" + emblem.code

        # Foto según ciudad elegida
        city_photo = select_city_photo(city_id=city_id, city_name=city_name)
        city_base_url = getattr(
            settings,
            "CITY_PHOTO_BASE_URL",
            "https://cdn.example.com/cities/",
        )
        city_photo_url = city_base_url.rstrip("/") + "/" + city_photo.code

        data = {
            "city_id": city_id,
            "city_name": city_name,
            "condition": condition,
            "temp_c": temp_c,
            "is_daytime": is_daytime,
            "emblem_photo": emblem.code,
            "emblem_photo_url": emblem_photo_url,
            "city_photo": city_photo.code,
            "city_photo_url": city_photo_url,
        }

        return Response(data, status=status.HTTP_200_OK)


class TimeSeriesView(APIView):
    """
    Endpoint para obtener series temporales agregadas de variables meteorológicas.
    
    GET /api/metrics/timeseries/
    
    Parámetros requeridos:
    - city_id (int): ID de la ciudad
    - variable (str): Variable meteorológica
      * temp, temperature (en °C)
      * humedad, humidity (%)
      * viento, wind, wind_speed (km/h)
      * presión, pressure (hPa)
    - time_range (str): Rango temporal
      * last_1h, 1h
      * last_6h, 6h
      * last_24h, 1d, 24h
      * last_48h, 2d
      * 7d, last_7d
      * 30d, last_30d
    
    Parámetros opcionales:
    - aggregation (str): Tipo de agregación
      * hourly, hour, h (promedio por hora)
      * daily, day, d (promedio por día)
      * raw (datos sin agregar, solo si time_range < 24h)
    
    Ejemplos:
    /api/metrics/timeseries/?city_id=1&variable=temp&time_range=24h
    /api/metrics/timeseries/?city_id=1&variable=humidity&time_range=7d&aggregation=daily
    /api/metrics/timeseries/?city_id=1&variable=wind_speed&time_range=last_48h&aggregation=hourly
    
    Respuesta:
    {
        "city_id": 1,
        "city_name": "Madrid",
        "variable": "temp",
        "variable_field": "temperature",
        "unit": "°C",
        "time_range": "24h",
        "aggregation": "hourly",
        "data": [
            {
                "timestamp": "2025-12-11T00:00:00Z",
                "value": 15.5
            },
            ...
        ],
        "metadata": {
            "total_points": 24,
            "start_time": "2025-12-11T00:00:00Z",
            "end_time": "2025-12-12T00:00:00Z",
            "has_data": true
        }
    }
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # Validar parámetros de entrada
        serializer = TimeSeriesInputSerializer(data=request.query_params)
        
        if not serializer.is_valid():
            return Response(
                {
                    "error": "Parámetros inválidos",
                    "details": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated_data = serializer.validated_data
        city_id = validated_data['city_id']
        variable = validated_data['variable']
        time_range = validated_data['time_range']
        aggregation = validated_data.get('aggregation') or None

        try:
            # Intentar obtener datos del caché
            # Usamos una clave simplificada para el caché inicial
            cached_data = get_cached_timeseries(
                city_id,
                variable.lower(),
                time_range.lower(),
                aggregation.lower() if aggregation else "raw"
            )
            
            if cached_data is not None:
                logger.info(
                    f"Cache hit: city_id={city_id}, variable={variable}, "
                    f"time_range={time_range}, aggregation={aggregation}"
                )
                response_serializer = TimeSeriesResponseSerializer(cached_data)
                return Response(response_serializer.data, status=status.HTTP_200_OK)

            # Construir serie temporal si no está en caché
            logger.info(
                f"Building time series: city_id={city_id}, variable={variable}, "
                f"time_range={time_range}, aggregation={aggregation}"
            )
            
            time_series_data = build_time_series(
                city_id=city_id,
                variable=variable,
                time_range=time_range,
                aggregation=aggregation
            )

            # Validar respuesta con serializer
            response_serializer = TimeSeriesResponseSerializer(time_series_data)
            
            # Almacenar en caché
            set_cached_timeseries(
                city_id,
                variable.lower(),
                time_range.lower(),
                aggregation.lower() if aggregation else "raw",
                response_serializer.data
            )

            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except TimeSeriesValidationError as e:
            logger.warning(f"Validation error: {str(e)}")
            return Response(
                {
                    "error": "Parámetros inválidos",
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            logger.error(f"Unexpected error building time series: {str(e)}")
            return Response(
                {
                    "error": "Error interno del servidor",
                    "detail": "Error procesando la serie temporal"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================================
# API DE CIUDADES - SOLO LECTURA
# ============================================================================

class CityPagination(PageNumberPagination):
    """Paginación para listado de ciudades"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class CityListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        search = request.query_params.get('search', None)
        comunidad = request.query_params.get('comunidad_autonoma', None)

        qs = CityDocument.objects()
        if search:
            qs = qs.filter(name__icontains=search)
        if comunidad:
            qs = qs.filter(comunidad_autonoma__iexact=comunidad)

        cities = qs.order_by('name')
        data = []
        for c in cities:
            data.append({
                'id': c.id,
                'name': c.name,
                'latitud': c.latitud,
                'longitud': c.longitud,
                'altitud': getattr(c, 'altitud', None),
                'comunidad_autonoma': getattr(c, 'comunidad_autonoma', None),
            })

        serializer = CitySerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CityDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk, *args, **kwargs):
        city = CityDocument.objects(id=pk).first()
        if not city:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CitySerializer({
            'id': city.id,
            'name': city.name,
            'latitud': city.latitud,
            'longitud': city.longitud,
            'altitud': getattr(city, 'altitud', None),
            'comunidad_autonoma': getattr(city, 'comunidad_autonoma', None),
        })
        return Response(serializer.data, status=status.HTTP_200_OK)


class SunriseSunsetView(APIView):
    """
    Endpoint para obtener datos de amanecer/atardecer de una ciudad.
    No requiere observaciones meteorológicas, solo coordenadas de la ciudad.
    
    GET /api/weather/sunrise-sunset/?city_id=1
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        from datetime import datetime
        import pytz
        
        city_id = request.query_params.get("city_id")

        if city_id is None:
            return Response(
                {"detail": "city_id es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            city_id = int(city_id)
        except ValueError:
            return Response(
                {"detail": "city_id debe ser un entero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Obtener la ciudad
        city = CityDocument.objects(id=city_id).first()
        if not city:
            return Response({"detail": "city_id not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Usar fecha actual
        observation_date = datetime.now(pytz.UTC)

        # Calcular sunrise y sunset
        sun_data = calculate_sunrise_sunset(
            latitude=city.latitud,
            longitude=city.longitud,
            city_name=city.name,
            observation_date=observation_date
        )

        # Preparar datos de respuesta
        response_data = {
            "city_id": city.id,
            "city_name": city.name,
            "date": observation_date.date().isoformat(),
            "sunrise": sun_data['sunrise'],
            "sunset": sun_data['sunset'],
            "daylight_duration": sun_data['daylight_duration'],
            "sunrise_formatted": format_time_24h(sun_data['sunrise']),
            "sunset_formatted": format_time_24h(sun_data['sunset']),
            "daylight_duration_formatted": format_daylight_duration(sun_data['daylight_duration']),
        }
        
        return Response(response_data, status=status.HTTP_200_OK)


class AlertsListView(APIView):
    """
    Alert history endpoint with session-gated persistence.

    GET /api/alerts/
    - If user is authenticated: returns user's alerts sorted by creation date (newest first)
    - If user is anonymous: returns empty list

    POST /api/alerts/
    - If user is authenticated: saves a new alert with user association
    - If user is anonymous: returns 401 Unauthorized
    
    Expected POST payload:
    {
        "city_id": <int>,
        "title": "<string>",
        "type": "<string>",
        "message": "<string>"
    }
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        from .documents import AlertDocument
        
        if request.user.is_authenticated:
            # Fetch user's alerts, sorted by creation date (newest first)
            alerts = AlertDocument.objects(user_id=request.user.id).order_by('-created_at')
            alert_list = [alert.to_dict() for alert in alerts]
        else:
            # Anonymous users see no alerts
            alert_list = []
        
        return Response(alert_list, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        from .documents import AlertDocument
        
        # Require authentication to save alerts
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required to save alerts.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Extract and validate payload
        city_id = request.data.get('city_id')
        title = request.data.get('title')
        alert_type = request.data.get('type')
        message = request.data.get('message')
        
        if not all([city_id, title, alert_type, message]):
            return Response(
                {'detail': 'Missing required fields: city_id, title, type, message'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create and save new alert
            alert = AlertDocument(
                user_id=request.user.id,
                city_id=int(city_id),
                title=str(title),
                type=str(alert_type),
                message=str(message)
            )
            alert.save()
            
            return Response(
                alert.to_dict(),
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'detail': f'Failed to save alert: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

