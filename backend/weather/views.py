# backend/weather/views.py

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .prophet_service import build_prophet_forecast
from .emblem_photos import select_emblem_photo


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
    Endpoint para devolver condiciones actuales + foto emblemática
    que usará el dashboard de ATMOS.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        city_id = request.query_params.get("city_id")

        # TODO: sustituir estos placeholders con datos reales
        # por ahora dejamos valores fijos para probar la lógica
        condition = "clear"   # p.ej. "rain", "snow", "clouds", "clear"...
        temp_c = 18.0         # temperatura actual en ºC
        is_daytime = True     # True si es de día, False si es de noche

        emblem = select_emblem_photo(condition, temp_c, is_daytime)

        base_url = getattr(
            settings,
            "EMBLEM_PHOTO_BASE_URL",
            "https://cdn.example.com/emblems/",
        )
        emblem_url = base_url.rstrip("/") + "/" + emblem.code

        data = {
            "city_id": city_id,
            "condition": condition,
            "temp_c": temp_c,
            "is_daytime": is_daytime,
            "emblem_photo": emblem.code,
            "emblem_photo_url": emblem_url,
        }

        return Response(data, status=status.HTTP_200_OK)
