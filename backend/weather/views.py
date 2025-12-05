# backend/weather/views.py

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .prophet_service import build_prophet_forecast
from .emblem_photos import select_emblem_photo
from .city_photos import select_city_photo
from .models import City, WeatherObservation
from .serializers import CurrentWeatherSerializer


class CurrentWeatherView(APIView):
    """
    Endpoint para obtener los datos del clima actual de una ciudad.
    
    GET /api/weather/current/?city_id=1
    
    Devuelve la observación más reciente de esa ciudad.
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
            "condition": "Parcialmente nublado",  # TODO: obtener del modelo cuando esté disponible
        }
        
        serializer = CurrentWeatherSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProphetForecastView(APIView):
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

        points = build_prophet_forecast(city_id=city_id, periods=periods)

        return Response(
            {
                "city_id": city_id,
                "periods": periods,
                "points": points,
            },
            status=status.HTTP_200_OK,
        )


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
