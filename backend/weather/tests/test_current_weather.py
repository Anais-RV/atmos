from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status

from weather.models import City, WeatherObservation


class CurrentWeatherTests(APITestCase):
    """Tests para el endpoint CurrentWeatherView"""

    def setUp(self):
        """Crear datos de prueba"""
        # Crear ciudades de prueba
        self.madrid = City.objects.create(name="Madrid")
        self.barcelona = City.objects.create(name="Barcelona")

        # Crear observaciones de clima
        now = timezone.now()
        WeatherObservation.objects.create(
            city=self.madrid,
            timestamp=now,
            temperature=18.3,
            condition="Parcialmente nublado",
        )
        WeatherObservation.objects.create(
            city=self.barcelona,
            timestamp=now,
            temperature=22.1,
            condition="Soleado",
        )

    def test_current_weather_returns_latest_observation(self):
        """
        Verificar que GET /api/weather/current/?city_id=X devuelve
        la observación más reciente para una ciudad
        """
        url = reverse("current-weather")
        response = self.client.get(url, {"city_id": self.madrid.id}, format="json")

        # 1) Status 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 2) Contiene los campos esperados
        self.assertIn("city_id", response.data)
        self.assertIn("city_name", response.data)
        self.assertIn("temperature", response.data)
        self.assertIn("condition", response.data)
        self.assertIn("timestamp", response.data)

        # 3) Los datos coinciden
        self.assertEqual(response.data["city_id"], self.madrid.id)
        self.assertEqual(response.data["city_name"], "Madrid")
        self.assertEqual(response.data["temperature"], 18.3)
        self.assertEqual(response.data["condition"], "Parcialmente nublado")

    def test_current_weather_returns_404_without_city_id(self):
        """
        Verificar que devuelve error si no se proporciona city_id
        """
        url = reverse("current-weather")
        response = self.client.get(url, format="json")

        # Debe devolver 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_current_weather_returns_404_for_nonexistent_city(self):
        """
        Verificar que devuelve 404 si la ciudad no existe
        """
        url = reverse("current-weather")
        response = self.client.get(url, {"city_id": 9999}, format="json")

        # Debe devolver 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_current_weather_returns_latest_when_multiple_observations(self):
        """
        Verificar que devuelve la observación más reciente
        cuando hay múltiples para la misma ciudad
        """
        now = timezone.now()
        older_time = now - timezone.timedelta(hours=1)

        # Crear una observación más antigua
        WeatherObservation.objects.create(
            city=self.madrid,
            timestamp=older_time,
            temperature=15.0,
            condition="Lluvioso",
        )

        url = reverse("current-weather")
        response = self.client.get(url, {"city_id": self.madrid.id}, format="json")

        # Debe devolver la más reciente (18.3, no 15.0)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["temperature"], 18.3)

    def test_current_weather_different_cities(self):
        """
        Verificar que devuelve datos diferentes para ciudades diferentes
        """
        url = reverse("current-weather")

        # Madrid
        response_madrid = self.client.get(
            url, {"city_id": self.madrid.id}, format="json"
        )
        self.assertEqual(response_madrid.data["city_name"], "Madrid")
        self.assertEqual(response_madrid.data["temperature"], 18.3)

        # Barcelona
        response_barcelona = self.client.get(
            url, {"city_id": self.barcelona.id}, format="json"
        )
        self.assertEqual(response_barcelona.data["city_name"], "Barcelona")
        self.assertEqual(response_barcelona.data["temperature"], 22.1)
