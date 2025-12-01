from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status

from weather.models import City, WeatherObservation


class ProphetForecastTests(APITestCase):
    def setUp(self):
        # Creamos una ciudad de prueba
        self.city = City.objects.create(name="Madrid")

        # Generamos 10 observaciones horarias de temperatura
        base_time = timezone.now() - timezone.timedelta(hours=10)
        for i in range(10):
            WeatherObservation.objects.create(
                city=self.city,
                timestamp=base_time + timezone.timedelta(hours=i),
                temperature=20 + i * 0.5,  # 20.0, 20.5, 21.0, ...
            )

    def test_prophet_forecast_endpoint_returns_predictions(self):
        """
        Comprobar que el endpoint /api/forecast/prophet/ devuelve
        un número de puntos igual al solicitado y con las claves esperadas.
        """
        url = reverse("prophet-forecast")
        response = self.client.get(
            url,
            {"city_id": self.city.id, "periods": 5},
            format="json",
        )

        # 1) La respuesta debe ser 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 2) Debe contener la clave 'points'
        self.assertIn("points", response.data)

        # 3) Debe devolver 5 puntos de predicción
        self.assertEqual(len(response.data["points"]), 5)

        # 4) Cada punto debe tener ts, yhat, yhat_lower, yhat_upper
        point = response.data["points"][0]
        for key in ("ts", "yhat", "yhat_lower", "yhat_upper"):
            self.assertIn(key, point)

    def test_prophet_forecast_returns_empty_list_if_no_data(self):
        """
        Si no hay datos históricos para esa ciudad, devolvemos una lista vacía de puntos.
        """
        # Creamos otra ciudad sin observaciones
        empty_city = City.objects.create(name="CiudadSinDatos")

        url = reverse("prophet-forecast")
        response = self.client.get(
            url,
            {"city_id": empty_city.id, "periods": 5},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("points", response.data)
        self.assertEqual(response.data["points"], [])
