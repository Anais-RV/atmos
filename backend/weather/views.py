from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .prophet_service import build_prophet_forecast
from .models import City, WeatherObservation
from .serializers import CurrentWeatherSerializer
from .cache_service import (
    get_cached_weather,
    set_cached_weather,
    get_cached_forecast,
    set_cached_forecast,
)


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
        city = get_object_or_404(City, id=city_id)
        
        # Obtener la observación más reciente
        latest_observation = city.observations.order_by("-timestamp").first()
        
        if latest_observation is None:
            return Response(
                {
                    "detail": f"No hay datos meteorológicos para la ciudad '{city.name}'",
                    "city_id": city_id,
                    "city_name": city.name,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Preparar datos y serializar
        data = {
            "city_id": city.id,
            "city_name": city.name,
            "temperature": latest_observation.temperature,
            "timestamp": latest_observation.timestamp,
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

