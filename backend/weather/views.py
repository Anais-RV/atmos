from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import City
from .serializers import CurrentWeatherSerializer
from .prophet_service import build_prophet_forecast


class CurrentWeatherView(APIView):
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

        city = get_object_or_404(City, id=city_id)
        
        # Obtener la observación más reciente
        observation = city.observations.latest("timestamp")
        
        # Construir respuesta manualmente
        data = {
            "city_id": city.id,
            "city_name": city.name,
            "temperature": observation.temperature,
            "condition": observation.condition,
            "timestamp": observation.timestamp,
        }

        return Response(data, status=status.HTTP_200_OK)


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
