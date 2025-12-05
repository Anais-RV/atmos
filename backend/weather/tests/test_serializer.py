# Test en el serialzers
from django.test import TestCase
from rest_framework import status
from models import WeatherObservation

# ✅ Usa TestCase para probar modelos
class WeatherObservationModelTestCase(TestCase):
    def test_str_representation(self):
        weather = WeatherObservation.objects.create(
            temperature=30.0,
            humidity=60,
            pressure=40
        )
        self.assertIn("30.0°C", str(weather))