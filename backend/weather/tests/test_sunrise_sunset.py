"""
Tests para el módulo de sunrise/sunset (amanecer/atardecer)
"""

from datetime import datetime
import pytz
from django.test import TestCase
from weather.sunrise_sunset import (
    calculate_sunrise_sunset,
    format_time_12h,
    format_time_24h,
    format_daylight_duration
)


class SunriseSunsetCalculationTest(TestCase):
    """Tests para los cálculos de amanecer y atardecer"""

    def test_calculate_sunrise_sunset_madrid(self):
        """Verifica cálculo para Madrid con coordenadas conocidas"""
        # Madrid: 40.4168° N, 3.7038° W
        # En solsticio de verano (21 junio 2024)
        date = datetime(2024, 6, 21, 12, 0, 0, tzinfo=pytz.UTC)
        
        result = calculate_sunrise_sunset(
            latitude=40.4168,
            longitude=-3.7038,
            city_name="Madrid",
            observation_date=date
        )
        
        # Verificar que devuelve las claves correctas
        self.assertIn('sunrise', result)
        self.assertIn('sunset', result)
        self.assertIn('daylight_duration', result)
        
        # Verificar que son datetime
        self.assertIsInstance(result['sunrise'], datetime)
        self.assertIsInstance(result['sunset'], datetime)
        
        # Verificar que sunset es después de sunrise
        self.assertGreater(result['sunset'], result['sunrise'])
        
        # En verano, la duración del día debe ser mayor a 14 horas (50400 segundos)
        self.assertGreater(result['daylight_duration'], 50400)

    def test_calculate_sunrise_sunset_barcelona(self):
        """Verifica cálculo para Barcelona"""
        # Barcelona: 41.3874° N, 2.1686° E
        date = datetime(2024, 12, 21, 12, 0, 0, tzinfo=pytz.UTC)
        
        result = calculate_sunrise_sunset(
            latitude=41.3874,
            longitude=2.1686,
            city_name="Barcelona",
            observation_date=date
        )
        
        # En invierno, la duración del día debe ser menor a 10 horas (36000 segundos)
        self.assertLess(result['daylight_duration'], 36000)

    def test_calculate_sunrise_sunset_default_date(self):
        """Verifica que usa fecha actual por defecto"""
        result = calculate_sunrise_sunset(
            latitude=40.4168,
            longitude=-3.7038,
            city_name="Madrid"
        )
        
        # Debe devolver resultados válidos
        self.assertIsNotNone(result['sunrise'])
        self.assertIsNotNone(result['sunset'])
        self.assertIsNotNone(result['daylight_duration'])

    def test_calculate_sunrise_sunset_equator(self):
        """Verifica cálculo en el ecuador (duración similar todo el año)"""
        # Quito, Ecuador: -0.1807° S, -78.4678° W
        date = datetime(2024, 6, 21, 12, 0, 0, tzinfo=pytz.UTC)
        
        result = calculate_sunrise_sunset(
            latitude=-0.1807,
            longitude=-78.4678,
            city_name="Quito",
            observation_date=date
        )
        
        # En el ecuador, duración del día ~12 horas (43200 segundos ±1 hora)
        self.assertGreater(result['daylight_duration'], 39600)  # > 11h
        self.assertLess(result['daylight_duration'], 46800)     # < 13h


class SunriseSunsetFormattingTest(TestCase):
    """Tests para las funciones de formateo"""

    def test_format_time_12h(self):
        """Verifica formato 12h (AM/PM)"""
        dt = datetime(2024, 6, 21, 6, 30, 0, tzinfo=pytz.UTC)
        formatted = format_time_12h(dt)
        self.assertEqual(formatted, '06:30 AM')
        
        dt = datetime(2024, 6, 21, 18, 45, 0, tzinfo=pytz.UTC)
        formatted = format_time_12h(dt)
        self.assertEqual(formatted, '06:45 PM')

    def test_format_time_12h_noon(self):
        """Verifica formato 12h para mediodía"""
        dt = datetime(2024, 6, 21, 12, 0, 0, tzinfo=pytz.UTC)
        formatted = format_time_12h(dt)
        self.assertEqual(formatted, '12:00 PM')

    def test_format_time_12h_midnight(self):
        """Verifica formato 12h para medianoche"""
        dt = datetime(2024, 6, 21, 0, 0, 0, tzinfo=pytz.UTC)
        formatted = format_time_12h(dt)
        self.assertEqual(formatted, '12:00 AM')

    def test_format_time_12h_none(self):
        """Verifica que maneja None correctamente"""
        formatted = format_time_12h(None)
        self.assertIsNone(formatted)

    def test_format_time_24h(self):
        """Verifica formato 24h"""
        dt = datetime(2024, 6, 21, 6, 30, 0, tzinfo=pytz.UTC)
        formatted = format_time_24h(dt)
        self.assertEqual(formatted, '06:30')
        
        dt = datetime(2024, 6, 21, 18, 45, 0, tzinfo=pytz.UTC)
        formatted = format_time_24h(dt)
        self.assertEqual(formatted, '18:45')

    def test_format_time_24h_none(self):
        """Verifica que maneja None correctamente"""
        formatted = format_time_24h(None)
        self.assertIsNone(formatted)

    def test_format_daylight_duration(self):
        """Verifica formato de duración del día"""
        # 14 horas, 30 minutos, 15 segundos = 52215 segundos
        formatted = format_daylight_duration(52215)
        self.assertEqual(formatted, '14:30:15')
        
        # 9 horas exactas
        formatted = format_daylight_duration(32400)
        self.assertEqual(formatted, '09:00:00')

    def test_format_daylight_duration_none(self):
        """Verifica que maneja None correctamente"""
        formatted = format_daylight_duration(None)
        self.assertIsNone(formatted)

    def test_format_daylight_duration_zero(self):
        """Verifica formato para duración cero"""
        formatted = format_daylight_duration(0)
        self.assertEqual(formatted, '00:00:00')


class SunriseSunsetEdgeCasesTest(TestCase):
    """Tests para casos extremos"""

    def test_arctic_summer_long_day(self):
        """Verifica manejo de excepciones en regiones con sol de medianoche"""
        # Tromsø, Noruega: 69.6492° N, 18.9553° E
        # En verano puede tener sol de medianoche (sin amanecer/atardecer tradicional)
        date = datetime(2024, 6, 21, 12, 0, 0, tzinfo=pytz.UTC)
        
        # Esto debe lanzar ValueError porque el sol nunca se pone
        with self.assertRaises(ValueError) as context:
            calculate_sunrise_sunset(
                latitude=69.6492,
                longitude=18.9553,
                city_name="Tromsø",
                observation_date=date
            )
        
        # Verificar que el mensaje de error es el esperado
        self.assertIn("degrees below the horizon", str(context.exception))

    def test_southern_hemisphere_seasons_inverted(self):
        """Verifica que las estaciones están invertidas en hemisferio sur"""
        # Buenos Aires: -34.6037° S, -58.3816° W
        # Diciembre = verano en sur
        summer_date = datetime(2024, 12, 21, 12, 0, 0, tzinfo=pytz.UTC)
        summer_result = calculate_sunrise_sunset(
            latitude=-34.6037,
            longitude=-58.3816,
            city_name="Buenos Aires",
            observation_date=summer_date
        )
        
        # Junio = invierno en sur
        winter_date = datetime(2024, 6, 21, 12, 0, 0, tzinfo=pytz.UTC)
        winter_result = calculate_sunrise_sunset(
            latitude=-34.6037,
            longitude=-58.3816,
            city_name="Buenos Aires",
            observation_date=winter_date
        )
        
        # En verano (dic) debe ser más largo que en invierno (jun)
        self.assertGreater(
            summer_result['daylight_duration'],
            winter_result['daylight_duration']
        )
