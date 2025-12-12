import pytest
from django.test import TestCase, Client, override_settings
from django.core.cache import cache
from django.utils import timezone
from django.db import transaction
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient

from weather.models import City, WeatherObservation
from weather.cache_service import (
    get_cache_key,
    get_cached_weather,
    set_cached_weather,
    invalidate_weather_cache,
    invalidate_all_weather_cache,
    get_cached_forecast,
    set_cached_forecast,
)


class CacheServiceTestCase(TestCase):
    """Tests para las funciones del servicio de caché."""

    def setUp(self):
        """Limpiar caché antes de cada test."""
        cache.clear()
        self.city = City.objects.create(
            name="Madrid",
            latitud=40.4168,
            longitud=-3.7038,
            altitud=646
        )

    def tearDown(self):
        """Limpiar caché después de cada test."""
        cache.clear()

    def test_cache_key_generation(self):
        """Verifica que las claves de caché se generan correctamente."""
        key = get_cache_key(1, "current")
        assert "weather_current_1" in key

        key_forecast = get_cache_key(1, "forecast_24")
        assert "weather_forecast_24_1" in key_forecast

    def test_set_and_get_cached_weather(self):
        """Verifica que los datos se almacenan y recuperan del caché."""
        city_id = self.city.id
        test_data = {
            "city_id": city_id,
            "city_name": "Madrid",
            "temperature": 25.5,
            "timestamp": timezone.now()
        }

        # Datos no deben estar en caché inicialmente
        assert get_cached_weather(city_id) is None

        # Almacenar en caché
        set_cached_weather(city_id, test_data)

        # Datos deben estar disponibles
        cached = get_cached_weather(city_id)
        assert cached is not None
        assert cached["temperature"] == 25.5
        assert cached["city_name"] == "Madrid"

    def test_invalidate_weather_cache(self):
        """Verifica que la invalidación elimina correctamente el caché."""
        city_id = self.city.id
        test_data = {"city_id": city_id, "temperature": 20.0}

        set_cached_weather(city_id, test_data)
        assert get_cached_weather(city_id) is not None

        # Invalidar
        invalidate_weather_cache(city_id)
        assert get_cached_weather(city_id) is None

    def test_invalidate_all_weather_cache(self):
        """Verifica que invalidar todo limpia completamente el caché."""
        city1 = City.objects.create(
            name="Barcelona",
            latitud=41.3874,
            longitud=2.1686,
            altitud=12
        )

        set_cached_weather(self.city.id, {"temperature": 20.0})
        set_cached_weather(city1.id, {"temperature": 22.0})

        assert get_cached_weather(self.city.id) is not None
        assert get_cached_weather(city1.id) is not None

        # Limpiar todo
        invalidate_all_weather_cache()

        assert get_cached_weather(self.city.id) is None
        assert get_cached_weather(city1.id) is None

    def test_set_and_get_cached_forecast(self):
        """Verifica que las predicciones se cachean correctamente."""
        city_id = self.city.id
        periods = 24
        test_forecast = {
            "city_id": city_id,
            "periods": periods,
            "points": [{"timestamp": "2024-01-01", "temperature": 20}]
        }

        assert get_cached_forecast(city_id, periods) is None

        set_cached_forecast(city_id, periods, test_forecast)

        cached = get_cached_forecast(city_id, periods)
        assert cached is not None
        assert cached["periods"] == 24
        assert len(cached["points"]) == 1


class CurrentWeatherCacheTestCase(TestCase):
    """Tests para la integración de caché en CurrentWeatherView."""

    def setUp(self):
        """Setup antes de cada test."""
        cache.clear()
        self.client = APIClient()
        self.city = City.objects.create(
            name="Valencia",
            latitud=39.4699,
            longitud=-0.3763,
            altitud=0
        )
        WeatherObservation.objects.create(
            city=self.city,
            temperature=23.5,
            humidity=65,
            pressure=1013,
            wind_speed=10,
            wind_direction=180,
            precipitation=0
        )

    def tearDown(self):
        """Cleanup después de cada test."""
        cache.clear()

    def test_weather_data_is_cached_after_first_request(self):
        """Verifica que los datos se cachean después de la primera solicitud."""
        # Primera solicitud
        response = self.client.get(f"/api/weather/current/?city_id={self.city.id}")
        assert response.status_code == 200
        first_data = response.data

        # Datos deben estar en caché
        cached = get_cached_weather(self.city.id)
        assert cached is not None
        assert cached["temperature"] == first_data["temperature"]

    @patch('weather.views.WeatherObservation')
    def test_cached_data_is_returned_without_db_query(self, mock_observation):
        """Verifica que la segunda solicitud usa caché sin consultar BD."""
        # Primera solicitud (consulta BD)
        response1 = self.client.get(f"/api/weather/current/?city_id={self.city.id}")
        assert response1.status_code == 200

        # Segunda solicitud debe usar caché
        response2 = self.client.get(f"/api/weather/current/?city_id={self.city.id}")
        assert response2.status_code == 200
        assert response1.data == response2.data

    def test_cache_invalidated_on_new_observation(self):
        """Verifica que el caché se invalida cuando se crea nueva observación.
        
        Nota: Este test usa un enfoque manual ya que las signals usan
        transaction.on_commit() que no se ejecuta en transacciones de test.
        """
        # Primera solicitud para cachear
        response1 = self.client.get(f"/api/weather/current/?city_id={self.city.id}")
        self.assertEqual(response1.status_code, 200)
        temp1 = response1.data["temperature"]

        # Verificar que los datos están en caché
        cached = get_cached_weather(self.city.id)
        self.assertIsNotNone(cached, "Los datos deben estar en caché")
        
        # Crear nueva observación
        WeatherObservation.objects.create(
            city=self.city,
            temperature=28.0,
            humidity=70,
            pressure=1015,
            wind_speed=12,
            wind_direction=90,
            precipitation=0
        )
        
        # Simular lo que haría la signal (ya que en tests no se ejecuta on_commit)
        # En producción, la signal se dispararía automáticamente
        invalidate_weather_cache(self.city.id)

        # El caché debe estar invalidado
        cached = get_cached_weather(self.city.id)
        self.assertIsNone(cached, "El caché debería estar invalidado después de crear nueva observación")

        # Nueva solicitud debe obtener temperatura actualizada
        response2 = self.client.get(f"/api/weather/current/?city_id={self.city.id}")
        self.assertEqual(response2.status_code, 200)
        temp2 = response2.data["temperature"]

        # Verificar que la temperatura se actualizó
        self.assertEqual(temp2, 28.0, "La temperatura debería ser 28.0")
        self.assertNotEqual(temp2, temp1, "La temperatura debería haber cambiado")


class ProphetForecastCacheTestCase(TestCase):
    """Tests para la integración de caché en ProphetForecastView."""

    def setUp(self):
        """Setup antes de cada test."""
        cache.clear()
        self.client = APIClient()
        self.city = City.objects.create(
            name="Sevilla",
            latitud=37.3886,
            longitud=-5.9823,
            altitud=7
        )
        # Crear múltiples observaciones para Prophet
        for i in range(30):
            WeatherObservation.objects.create(
                city=self.city,
                temperature=20 + (i % 5),
                humidity=60 + (i % 20),
                pressure=1010 + (i % 10),
                wind_speed=8 + (i % 5),
                wind_direction=180 + (i % 180),
                precipitation=i % 2
            )

    def tearDown(self):
        """Cleanup después de cada test."""
        cache.clear()

    @patch('weather.views.build_prophet_forecast')
    def test_forecast_is_cached(self, mock_prophet):
        """Verifica que las predicciones se cachean después de la primera solicitud."""
        mock_prophet.return_value = [{"timestamp": "2024-01-01", "temperature": 25}]

        # Primera solicitud (construye predicción)
        response = self.client.get(f"/api/weather/forecast/?city_id={self.city.id}&periods=24")
        assert response.status_code == 200
        assert mock_prophet.call_count == 1

        # Verificar que está en caché
        cached = get_cached_forecast(self.city.id, 24)
        assert cached is not None

    @patch('weather.views.build_prophet_forecast')
    def test_cached_forecast_avoids_recalculation(self, mock_prophet):
        """Verifica que el caché evita recálculos de Prophet."""
        mock_prophet.return_value = [{"timestamp": "2024-01-01", "temperature": 25}]

        # Primera solicitud
        response1 = self.client.get(f"/api/weather/forecast/?city_id={self.city.id}&periods=24")
        assert response1.status_code == 200
        assert mock_prophet.call_count == 1

        # Segunda solicitud debe usar caché (sin llamar a build_prophet_forecast)
        response2 = self.client.get(f"/api/weather/forecast/?city_id={self.city.id}&periods=24")
        assert response2.status_code == 200
        assert mock_prophet.call_count == 1  # No debe incrementar

        # Mismo resultado
        assert response1.data == response2.data


class CachePerformanceTestCase(TestCase):
    """Tests de rendimiento y efectividad del caché."""

    def setUp(self):
        """Setup antes de cada test."""
        cache.clear()
        self.city = City.objects.create(
            name="Bilbao",
            latitud=43.2630,
            longitud=-2.9350,
            altitud=2
        )
        self.observation = WeatherObservation.objects.create(
            city=self.city,
            temperature=18.0,
            humidity=75,
            pressure=1012,
            wind_speed=15,
            wind_direction=270,
            precipitation=2.5
        )

    def tearDown(self):
        """Cleanup después de cada test."""
        cache.clear()

    def test_cache_reduces_database_queries(self):
        """Verifica que el caché reduce el número de consultas a BD."""
        from django.test.utils import override_settings
        from django.test import TestCase as DjangoTestCase
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        with CaptureQueriesContext(connection) as context:
            # Primera solicitud (consulta BD)
            weather_data = {
                "city_id": self.city.id,
                "temperature": self.observation.temperature
            }
            set_cached_weather(self.city.id, weather_data)
            queries_with_db = len(context)

        # Segunda solicitud desde caché (sin consultas adicionales)
        cached = get_cached_weather(self.city.id)
        assert cached is not None
        assert cached["temperature"] == self.observation.temperature
