from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status

from weather.models import City, WeatherObservation


class CurrentWeatherTests(APITestCase):
    def setUp(self):
        """Crear datos de prueba"""
        self.city_madrid = City.objects.create(name="Madrid")
        self.city_barcelona = City.objects.create(name="Barcelona")

        # Crear observaciones para Madrid
        now = timezone.now()
        WeatherObservation.objects.create(
            city=self.city_madrid,
            timestamp=now - timezone.timedelta(hours=2),
            temperature=15.5,
        )
        WeatherObservation.objects.create(
            city=self.city_madrid,
            timestamp=now,  # La más reciente
            temperature=18.3,
        )

        # Crear observación para Barcelona
        WeatherObservation.objects.create(
            city=self.city_barcelona,
            timestamp=now - timezone.timedelta(hours=1),
            temperature=22.0,
        )

    def test_current_weather_returns_latest_observation(self):
        """
        Verificar que /api/weather/current/?city_id=X devuelve
        datos meteorológicos (ahora desde AEMET mock).
        """
        url = reverse("current-weather")
        response = self.client.get(url, {"city_id": self.city_madrid.id})

        # Debe ser 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que devuelve los datos esperados
        data = response.data
        self.assertEqual(data["city_id"], self.city_madrid.id)
        self.assertEqual(data["city_name"], "Madrid")
        # Ahora viene de AEMET mock, no de observaciones BD
        self.assertIn("temperature", data)
        self.assertIsInstance(data["temperature"], (int, float))
        self.assertIn("timestamp", data)

    def test_current_weather_missing_city_id(self):
        """Verificar que sin city_id devuelve error 400"""
        url = reverse("current-weather")
        response = self.client.get(url)  # Sin parámetros

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_current_weather_invalid_city_id(self):
        """Verificar que con city_id inválido devuelve error 404"""
        url = reverse("current-weather")
        response = self.client.get(url, {"city_id": 9999})  # No existe

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_current_weather_no_observations(self):
        """Verificar que aunque no haya observaciones BD, AEMET mock devuelve datos"""
        # Crear una ciudad sin observaciones
        city_no_data = City.objects.create(name="Sevilla")
        url = reverse("current-weather")
        response = self.client.get(url, {"city_id": city_no_data.id})

        # Ahora devuelve 200 con datos mock en lugar de 404
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("temperature", response.data)
        self.assertIn("city_name", response.data)

    def test_current_weather_multiple_cities(self):
        """Verificar que devuelve datos correctos para diferentes ciudades"""
        url = reverse("current-weather")

        # Probar Madrid
        response_madrid = self.client.get(url, {"city_id": self.city_madrid.id})
        self.assertEqual(response_madrid.status_code, status.HTTP_200_OK)
        self.assertIn("temperature", response_madrid.data)

        # Probar Barcelona
        response_barcelona = self.client.get(url, {"city_id": self.city_barcelona.id})
        self.assertEqual(response_barcelona.status_code, status.HTTP_200_OK)
        # Datos mock: verificar que tiene temperatura válida
        self.assertIn("temperature", response_barcelona.data)
        self.assertIsInstance(response_barcelona.data["temperature"], (int, float))
