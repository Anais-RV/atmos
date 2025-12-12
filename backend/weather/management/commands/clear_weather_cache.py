"""
Management command para limpiar y gestionar el caché de datos meteorológicos.

Uso:
    python manage.py clear_weather_cache              # Limpiar todo el caché
    python manage.py clear_weather_cache --city-id=1  # Limpiar caché de una ciudad específica
    python manage.py clear_weather_cache --forecast   # Limpiar solo caché de predicciones
"""

from django.core.management.base import BaseCommand
from weather.cache_service import (
    invalidate_all_weather_cache,
    invalidate_weather_cache,
    invalidate_forecast_cache,
)


class Command(BaseCommand):
    help = 'Limpia el caché de datos meteorológicos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--city-id',
            type=int,
            help='ID de la ciudad cuyo caché se invalidará (si no se especifica, invalida todo)',
        )
        parser.add_argument(
            '--forecast',
            action='store_true',
            help='Solo invalidar caché de predicciones',
        )
        parser.add_argument(
            '--current',
            action='store_true',
            help='Solo invalidar caché de datos actuales',
        )

    def handle(self, *args, **options):
        city_id = options.get('city_id')
        forecast_only = options.get('forecast')
        current_only = options.get('current')

        if city_id:
            # Invalidar caché de una ciudad específica
            if forecast_only:
                invalidate_forecast_cache(city_id)
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Caché de predicciones invalidado para ciudad {city_id}'
                    )
                )
            elif current_only:
                invalidate_weather_cache(city_id)
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Caché de datos actuales invalidado para ciudad {city_id}'
                    )
                )
            else:
                invalidate_weather_cache(city_id)
                invalidate_forecast_cache(city_id)
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Todo el caché invalidado para ciudad {city_id}'
                    )
                )
        else:
            # Invalidar todo el caché
            invalidate_all_weather_cache()
            self.stdout.write(
                self.style.SUCCESS('✓ Todo el caché de datos meteorológicos ha sido limpiado')
            )
