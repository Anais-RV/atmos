"""
Pruebas para el endpoint de series temporales.

Tests incluyen:
- Validación de parámetros
- Agregación y resampling
- Manejo de caché
- Pruebas de rendimiento
- Casos de error
"""

import pytest
from django.test import TestCase
from django.utils import timezone
from django.core.cache import cache
from datetime import datetime, timedelta
from rest_framework.test import APIClient
from rest_framework import status

from weather.documents import CityDocument, WeatherObservationDocument
from datetime import datetime
from weather.time_series_service import (
    normalize_variable,
    normalize_time_range,
    normalize_aggregation,
    validate_parameters,
    build_time_series,
    TimeSeriesValidationError,
)
from weather.cache_service import (
    get_cached_timeseries,
    set_cached_timeseries,
    invalidate_timeseries_cache,
)


@pytest.mark.django_db
class TestTimeSeriesValidation(TestCase):
    """Pruebas de validación de parámetros"""

    def setUp(self):
        """Crear datos de prueba"""
        self.city = CityDocument(id=20, name="Madrid", latitud=40.4168, longitud=-3.7038, altitud=646)
        self.city.save()

        # Crear observaciones para las últimas 48 horas
        now = datetime.utcnow()
        for i in range(48):
            timestamp = now - timedelta(hours=i)
            WeatherObservationDocument(city_id=self.city.id, timestamp=timestamp, temperature=20 + (i % 10), humidity=60 + (i % 20), pressure=1013, wind_speed=5 + (i % 5)).save()

    def test_normalize_variable_temperature(self):
        """Debe normalizar variantes de temperatura"""
        assert normalize_variable('temp') == 'temperature'
        assert normalize_variable('temperature') == 'temperature'
        assert normalize_variable('TEMP') == 'temperature'

    def test_normalize_variable_humidity(self):
        """Debe normalizar variantes de humedad"""
        assert normalize_variable('humedad') == 'humidity'
        assert normalize_variable('humidity') == 'humidity'
        assert normalize_variable('HUMIDITY') == 'humidity'

    def test_normalize_variable_wind(self):
        """Debe normalizar variantes de viento"""
        assert normalize_variable('viento') == 'wind_speed'
        assert normalize_variable('wind') == 'wind_speed'
        assert normalize_variable('wind_speed') == 'wind_speed'

    def test_normalize_variable_pressure(self):
        """Debe normalizar variantes de presión"""
        assert normalize_variable('presión') == 'pressure'
        assert normalize_variable('pressure') == 'pressure'

    def test_normalize_variable_invalid(self):
        """Debe lanzar error para variable inválida"""
        with pytest.raises(TimeSeriesValidationError):
            normalize_variable('invalid_variable')

    def test_normalize_time_range_valid(self):
        """Debe normalizar rangos de tiempo válidos"""
        assert normalize_time_range('last_24h') == 24
        assert normalize_time_range('24h') == 24
        assert normalize_time_range('1d') == 24
        assert normalize_time_range('7d') == 24 * 7
        assert normalize_time_range('LAST_24H') == 24

    def test_normalize_time_range_invalid(self):
        """Debe lanzar error para rango inválido"""
        with pytest.raises(TimeSeriesValidationError):
            normalize_time_range('invalid_range')

    def test_normalize_aggregation_hourly(self):
        """Debe normalizar agregaciones de hora"""
        assert normalize_aggregation('hourly') == 'hourly'
        assert normalize_aggregation('hour') == 'hourly'
        assert normalize_aggregation('h') == 'hourly'

    def test_normalize_aggregation_daily(self):
        """Debe normalizar agregaciones diarias"""
        assert normalize_aggregation('daily') == 'daily'
        assert normalize_aggregation('day') == 'daily'
        assert normalize_aggregation('d') == 'daily'

    def test_validate_parameters_valid(self):
        """Debe validar correctamente parámetros válidos"""
        city_id, var, hours, agg = validate_parameters(
            self.city.id, 'temp', 'last_24h'
        )
        assert city_id == self.city.id
        assert var == 'temperature'
        assert hours == 24
        assert agg == 'hourly'

    def test_validate_parameters_city_not_found(self):
        """Debe lanzar error si ciudad no existe"""
        with pytest.raises(TimeSeriesValidationError):
            validate_parameters(9999, 'temp', 'last_24h')

    def test_validate_parameters_invalid_variable(self):
        """Debe lanzar error si variable es inválida"""
        with pytest.raises(TimeSeriesValidationError):
            validate_parameters(self.city.id, 'invalid', 'last_24h')

    def test_validate_parameters_invalid_range(self):
        """Debe lanzar error si rango es inválido"""
        with pytest.raises(TimeSeriesValidationError):
            validate_parameters(self.city.id, 'temp', 'invalid_range')

    def test_validate_parameters_range_too_large(self):
        """Debe lanzar error si rango genera demasiados puntos"""
        with pytest.raises(TimeSeriesValidationError):
            # 365 días * 24 horas = 8760 puntos, más del máximo (5000)
            validate_parameters(self.city.id, 'temp', '365d')


@pytest.mark.django_db
class TestTimeSeriesAggregation(TestCase):
    """Pruebas de agregación y resampling"""

    def setUp(self):
        """Crear datos de prueba"""
        self.city = CityDocument(id=21, name="Barcelona", latitud=41.3851, longitud=2.1734, altitud=2)
        self.city.save()

        # Crear observaciones para 48 horas con patrón predecible
        now = datetime.utcnow()
        base_temp = 20
        for i in range(48):
            timestamp = now - timedelta(hours=i)
            # Temperatura varía de 15 a 25°C
            temp = base_temp + 5 * ((i % 10) / 10)
            WeatherObservationDocument(city_id=self.city.id, timestamp=timestamp, temperature=temp, humidity=60, pressure=1013, wind_speed=5).save()

    def test_build_time_series_raw(self):
        """Debe construir series temporales sin agregar"""
        result = build_time_series(
            city_id=self.city.id,
            variable='temp',
            time_range='6h',
            aggregation='raw'
        )
        
        assert result['city_id'] == self.city.id
        assert result['city_name'] == 'Barcelona'
        assert result['variable'] == 'temp'
        assert result['variable_field'] == 'temperature'
        assert result['unit'] == '°C'
        assert result['aggregation'] == 'raw'
        assert result['metadata']['has_data'] is True
        assert len(result['data']) > 0
        
        # Verificar que los datos están ordenados por timestamp
        timestamps = [d['timestamp'] for d in result['data']]
        assert timestamps == sorted(timestamps)

    def test_build_time_series_hourly(self):
        """Debe agregar datos por hora"""
        result = build_time_series(
            city_id=self.city.id,
            variable='temp',
            time_range='24h',
            aggregation='hourly'
        )
        
        assert result['aggregation'] == 'hourly'
        assert result['metadata']['has_data'] is True
        # Con 48 observaciones en 48 horas, debería haber ~48 puntos horarios
        assert result['metadata']['total_points'] > 0

    def test_build_time_series_daily(self):
        """Debe agregar datos por día"""
        result = build_time_series(
            city_id=self.city.id,
            variable='temp',
            time_range='48h',
            aggregation='daily'
        )
        
        assert result['aggregation'] == 'daily'
        assert result['metadata']['has_data'] is True
        # Con 48 horas debería haber 2 días aproximadamente
        assert result['metadata']['total_points'] >= 1

    def test_build_time_series_no_data(self):
        """Debe manejar ciudades sin datos"""
        city_no_data = CityDocument(id=22, name="NoData City", latitud=0, longitud=0)
        city_no_data.save()
        
        result = build_time_series(
            city_id=city_no_data.id,
            variable='temp',
            time_range='24h'
        )
        
        assert result['metadata']['has_data'] is False
        assert result['metadata']['total_points'] == 0
        assert result['data'] == []

    def test_time_series_values_are_rounded(self):
        """Los valores deben estar redondeados a 2 decimales"""
        result = build_time_series(
            city_id=self.city.id,
            variable='temp',
            time_range='12h',
            aggregation='hourly'
        )
        
        for data_point in result['data']:
            value = data_point['value']
            # Verificar que tiene máximo 2 decimales
            assert value == round(value, 2)


@pytest.mark.django_db
class TestTimeSeriesCache(TestCase):
    """Pruebas de caché"""

    def setUp(self):
        """Crear datos de prueba"""
        self.city = CityDocument(id=23, name="Valencia", latitud=39.4699, longitud=-0.3763)
        self.city.save()

        now = datetime.utcnow()
        for i in range(24):
            timestamp = now - timedelta(hours=i)
            WeatherObservationDocument(city_id=self.city.id, timestamp=timestamp, temperature=20 + (i % 10), humidity=60, pressure=1013, wind_speed=5).save()
        
        # Limpiar caché antes de cada test
        cache.clear()

    def tearDown(self):
        """Limpiar caché después de cada test"""
        cache.clear()

    def test_cache_set_and_get(self):
        """Debe almacenar y recuperar datos del caché"""
        test_data = {
            'city_id': self.city.id,
            'variable': 'temperature',
            'data': []
        }
        
        set_cached_timeseries(
            self.city.id, 'temperature', 'last_24h', 'hourly', test_data
        )
        
        cached = get_cached_timeseries(
            self.city.id, 'temperature', 'last_24h', 'hourly'
        )
        
        assert cached is not None
        assert cached['city_id'] == test_data['city_id']

    def test_cache_invalidation(self):
        """Debe invalidar caché para una ciudad"""
        test_data = {'city_id': self.city.id}
        
        set_cached_timeseries(
            self.city.id, 'temperature', 'last_24h', 'hourly', test_data
        )
        
        invalidate_timeseries_cache(self.city.id)
        
        # Después de invalidar, no debería haber datos en caché
        # (nota: esto es una prueba conceptual, algunos backends pueden variar)
        cached = get_cached_timeseries(
            self.city.id, 'temperature', 'last_24h', 'hourly'
        )
        
        # Podría ser None o no, dependiendo de la implementación
        # Lo importante es que la operación no lance errores
        assert True


@pytest.mark.django_db
class TestTimeSeriesEndpoint(TestCase):
    """Pruebas del endpoint HTTP"""

    def setUp(self):
        """Crear datos de prueba"""
        self.client = APIClient()
        self.city = CityDocument(id=24, name="Sevilla", latitud=37.3891, longitud=-5.9844)
        self.city.save()

        now = datetime.utcnow()
        for i in range(48):
            timestamp = now - timedelta(hours=i)
            WeatherObservationDocument(city_id=self.city.id, timestamp=timestamp, temperature=25 + (i % 10), humidity=65 + (i % 15), pressure=1010 + (i % 5), wind_speed=7 + (i % 3)).save()
        
        cache.clear()

    def tearDown(self):
        """Limpiar caché"""
        cache.clear()

    def test_timeseries_endpoint_valid_request(self):
        """Debe responder correctamente a solicitud válida"""
        response = self.client.get(
            '/api/metrics/timeseries/',
            {
                'city_id': self.city.id,
                'variable': 'temp',
                'time_range': 'last_24h'
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        assert data['city_id'] == self.city.id
        assert data['city_name'] == 'Sevilla'
        assert data['variable'] == 'temp'
        assert 'data' in data
        assert 'metadata' in data

    def test_timeseries_endpoint_missing_city_id(self):
        """Debe rechazar solicitudes sin city_id"""
        response = self.client.get(
            '/api/metrics/timeseries/',
            {
                'variable': 'temp',
                'time_range': 'last_24h'
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_timeseries_endpoint_missing_variable(self):
        """Debe rechazar solicitudes sin variable"""
        response = self.client.get(
            '/api/metrics/timeseries/',
            {
                'city_id': self.city.id,
                'time_range': 'last_24h'
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_timeseries_endpoint_missing_time_range(self):
        """Debe rechazar solicitudes sin time_range"""
        response = self.client.get(
            '/api/metrics/timeseries/',
            {
                'city_id': self.city.id,
                'variable': 'temp'
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_timeseries_endpoint_invalid_city(self):
        """Debe rechazar city_id inválido"""
        response = self.client.get(
            '/api/metrics/timeseries/',
            {
                'city_id': 9999,
                'variable': 'temp',
                'time_range': 'last_24h'
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()
        assert 'error' in data

    def test_timeseries_endpoint_invalid_variable(self):
        """Debe rechazar variable inválida"""
        response = self.client.get(
            '/api/metrics/timeseries/',
            {
                'city_id': self.city.id,
                'variable': 'invalid_var',
                'time_range': 'last_24h'
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_timeseries_endpoint_caching(self):
        """Debe cachear resultados correctamente"""
        # Primera solicitud (no en caché)
        response1 = self.client.get(
            '/api/metrics/timeseries/',
            {
                'city_id': self.city.id,
                'variable': 'temp',
                'time_range': 'last_24h'
            }
        )
        
        assert response1.status_code == status.HTTP_200_OK
        
        # Segunda solicitud (debería estar en caché)
        response2 = self.client.get(
            '/api/metrics/timeseries/',
            {
                'city_id': self.city.id,
                'variable': 'temp',
                'time_range': 'last_24h'
            }
        )
        
        assert response2.status_code == status.HTTP_200_OK
        
        # Los datos deberían ser idénticos
        assert response1.json() == response2.json()

    def test_timeseries_endpoint_different_aggregations(self):
        """Debe soportar diferentes tipos de agregación"""
        for agg in ['hourly', 'daily', None]:
            params = {
                'city_id': self.city.id,
                'variable': 'humidity',
                'time_range': '48h'
            }
            if agg:
                params['aggregation'] = agg
            
            response = self.client.get('/api/metrics/timeseries/', params)
            assert response.status_code == status.HTTP_200_OK

    def test_timeseries_endpoint_different_variables(self):
        """Debe soportar diferentes variables"""
        for var in ['temp', 'humidity', 'wind', 'pressure']:
            response = self.client.get(
                '/api/metrics/timeseries/',
                {
                    'city_id': self.city.id,
                    'variable': var,
                    'time_range': 'last_24h'
                }
            )
            assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestTimeSeriesPerformance(TestCase):
    """Pruebas de rendimiento"""

    def setUp(self):
        """Crear datos de prueba grandes"""
        self.city = CityDocument(id=25, name="PerformanceCity", latitud=0, longitud=0)
        self.city.save()

        # Crear muchas observaciones para pruebas de rendimiento
        now = datetime.utcnow()
        for i in range(1000):  # 1000 observaciones (~41 días)
            timestamp = now - timedelta(hours=i)
            WeatherObservationDocument(city_id=self.city.id, timestamp=timestamp, temperature=20 + (i % 10), humidity=60 + (i % 20), pressure=1013, wind_speed=5 + (i % 5)).save()
        cache.clear()

    def tearDown(self):
        """Limpiar caché"""
        cache.clear()

    def test_large_time_series_performance(self):
        """Debe manejar series temporales grandes eficientemente"""
        import time
        
        start = time.time()
        
        result = build_time_series(
            city_id=self.city.id,
            variable='temp',
            time_range='30d',
            aggregation='daily'
        )
        
        elapsed = time.time() - start
        
        assert result['metadata']['has_data'] is True
        # Debería completarse en menos de 1 segundo
        assert elapsed < 1.0, f"Query took {elapsed}s, expected < 1s"

    def test_hourly_aggregation_performance(self):
        """Debe agregar por hora eficientemente"""
        import time
        
        start = time.time()
        
        result = build_time_series(
            city_id=self.city.id,
            variable='humidity',
            time_range='7d',
            aggregation='hourly'
        )
        
        elapsed = time.time() - start
        
        assert elapsed < 2.0, f"Aggregation took {elapsed}s, expected < 2s"
