import json
import os
from django.core.management.base import BaseCommand
from weather.documents import CityDocument


class Command(BaseCommand):
    help = "Carga ciudades desde un archivo JSON. Evita duplicados automáticamente."

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='data/cities.json',
            help='Ruta al archivo JSON con las ciudades (por defecto: data/cities.json)',
        )

    def handle(self, *args, **options):
        file_path = options['file']
        
        # Validar que el archivo existe
        if not os.path.exists(file_path):
            self.stdout.write(
                self.style.ERROR(f'Archivo no encontrado: {file_path}')
            )
            return

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                cities_data = json.load(f)
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(f'Error al leer JSON: archivo corrupto')
            )
            return

        if not isinstance(cities_data, list):
            self.stdout.write(
                self.style.ERROR(f'El archivo debe contener una lista de ciudades')
            )
            return

        created_count = 0
        skipped_count = 0
        errors = []

        for city_data in cities_data:
            try:
                nombre = city_data.get('nombre', '').strip()
                comunidad = city_data.get('comunidad_autonoma', '').strip()

                # Buscar si ya existe (nombre + comunidad)
                existing = CityDocument.objects(name=nombre, comunidad_autonoma=comunidad).first()
                if existing:
                    skipped_count += 1
                    continue

                city = CityDocument(
                    id=CityDocument.get_next_id(),
                    name=nombre,
                    latitud=float(city_data.get('latitud', 0) or 0),
                    longitud=float(city_data.get('longitud', 0) or 0),
                    altitud=(float(city_data.get('altitud')) if city_data.get('altitud') not in (None, '') else None),
                    comunidad_autonoma=comunidad,
                )
                city.save()
                created_count += 1

            except (ValueError, KeyError, TypeError) as e:
                errors.append(f"Ciudad {city_data.get('nombre', 'desconocida')}: {str(e)}")
            except Exception as e:
                errors.append(f"Error inesperado: {str(e)}")

        # Reporte de ejecución
        self.stdout.write(self.style.SUCCESS('\n=== CARGA COMPLETADA ==='))
        self.stdout.write(f'Ciudades creadas: {created_count}')
        self.stdout.write(f'Ciudades omitidas (duplicadas): {skipped_count}')
        
        total_cities = CityDocument.objects.count()
        self.stdout.write(f'Total de ciudades en BD: {total_cities}\n')

        if errors:
            self.stdout.write(self.style.WARNING('\nErrores encontrados:'))
            for error in errors:
                self.stdout.write(f'  - {error}')
