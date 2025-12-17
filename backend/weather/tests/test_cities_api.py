import json
from django.test import TestCase
from django.core.management import call_command
from rest_framework.test import APITestCase
from rest_framework import status
from io import StringIO

from weather.models import City


class LoadCitiesCommandTest(TestCase):
    """Tests para el comando load_cities"""
    
    def test_load_cities_from_json(self):
        """Verifica que el comando carga ciudades correctamente"""
        call_command('load_cities', '--file', 'data/cities.json')
        
        # Debe haber al menos 50 ciudades cargadas
        self.assertGreaterEqual(City.objects.count(), 50)
    
    def test_command_is_idempotent(self):
        """Verifica que ejecutar el comando varias veces no crea duplicados"""
        call_command('load_cities', '--file', 'data/cities.json')
        count_after_first_load = City.objects.count()
        
        # Ejecutar nuevamente
        call_command('load_cities', '--file', 'data/cities.json')
        count_after_second_load = City.objects.count()
        
        # Las cuentas deben ser idénticas (no hay duplicados)
        self.assertEqual(count_after_first_load, count_after_second_load)
    
    def test_load_cities_with_comunidad_autonoma(self):
        """Verifica que las ciudades tienen comunidad_autonoma"""
        call_command('load_cities', '--file', 'data/cities.json')
        
        madrid = City.objects.get(name='Madrid')
        self.assertEqual(madrid.comunidad_autonoma, 'Madrid')
        self.assertIsNotNone(madrid.latitud)
        self.assertIsNotNone(madrid.longitud)
    
    def test_load_cities_invalid_file(self):
        """Verifica manejo de archivo no existente"""
        out = StringIO()
        call_command('load_cities', '--file', 'nonexistent.json', stdout=out)
        self.assertIn('Archivo no encontrado', out.getvalue())


class CityAPITest(APITestCase):
    """Tests para los endpoints de ciudades"""
    
    @classmethod
    def setUpTestData(cls):
        """Prepara datos de prueba"""
        # Crear algunas ciudades de prueba
        cls.madrid = City.objects.create(
            name='Madrid',
            latitud=40.4168,
            longitud=-3.7038,
            altitud=640,
            comunidad_autonoma='Madrid'
        )
        cls.barcelona = City.objects.create(
            name='Barcelona',
            latitud=41.3851,
            longitud=2.1734,
            altitud=12,
            comunidad_autonoma='Cataluña'
        )
        cls.valencia = City.objects.create(
            name='Valencia',
            latitud=39.4699,
            longitud=-0.3763,
            altitud=0,
            comunidad_autonoma='Comunidad Valenciana'
        )
        cls.sevilla = City.objects.create(
            name='Sevilla',
            latitud=37.3886,
            longitud=-5.9823,
            altitud=7,
            comunidad_autonoma='Andalucía'
        )
    
    def test_cities_list_get_200(self):
        """Verifica que GET a lista de ciudades devuelve 200"""
        response = self.client.get('/api/weather/cities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
    
    def test_cities_list_has_pagination(self):
        """Verifica que la lista está paginada"""
        response = self.client.get('/api/weather/cities/')
        self.assertIn('count', response.data)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('results', response.data)
    
    def test_city_detail_get_200(self):
        """Verifica que GET a detalle de ciudad devuelve 200"""
        response = self.client.get(f'/api/weather/cities/{self.madrid.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Madrid')
        self.assertEqual(response.data['comunidad_autonoma'], 'Madrid')
    
    def test_city_detail_not_found(self):
        """Verifica que city no existente devuelve 404"""
        response = self.client.get('/api/weather/cities/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_city_search_by_name(self):
        """Verifica búsqueda por nombre"""
        response = self.client.get('/api/weather/cities/?search=madrid')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        results = response.data['results']
        self.assertTrue(any(city['name'] == 'Madrid' for city in results))
    
    def test_city_search_case_insensitive(self):
        """Verifica que búsqueda es case-insensitive"""
        response = self.client.get('/api/weather/cities/?search=MADRID')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        results = response.data['results']
        self.assertTrue(any(city['name'] == 'Madrid' for city in results))
    
    def test_city_search_no_results(self):
        """Verifica búsqueda sin resultados"""
        response = self.client.get('/api/weather/cities/?search=inexistente')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
    
    def test_city_filter_by_comunidad_autonoma(self):
        """Verifica filtro por comunidad autónoma"""
        response = self.client.get('/api/weather/cities/?comunidad_autonoma=Cataluña')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        results = response.data['results']
        self.assertTrue(any(city['name'] == 'Barcelona' for city in results))
        # Verificar que no hay ciudades de otras comunidades
        self.assertFalse(any(city['name'] == 'Madrid' for city in results))
    
    def test_city_filter_case_insensitive(self):
        """Verifica que filtro de comunidad es case-insensitive"""
        response = self.client.get('/api/weather/cities/?comunidad_autonoma=cataluña')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        results = response.data['results']
        self.assertTrue(any(city['name'] == 'Barcelona' for city in results))
    
    def test_city_filter_no_results(self):
        """Verifica filtro sin resultados"""
        response = self.client.get('/api/weather/cities/?comunidad_autonoma=NoExiste')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
    
    def test_cities_search_and_filter_combined(self):
        """Verifica combinación de búsqueda y filtro"""
        response = self.client.get(
            '/api/weather/cities/?search=celona&comunidad_autonoma=Cataluña'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        results = response.data['results']
        self.assertTrue(any(city['name'] == 'Barcelona' for city in results))
    
    def test_city_list_serializer_fields(self):
        """Verifica que el serializer expone los campos correctos"""
        response = self.client.get(f'/api/weather/cities/{self.madrid.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        self.assertIn('id', data)
        self.assertIn('name', data)
        self.assertIn('latitud', data)
        self.assertIn('longitud', data)
        self.assertIn('altitud', data)
        self.assertIn('comunidad_autonoma', data)
    
    def test_cities_post_method_not_allowed(self):
        """Verifica que POST devuelve 405 Método no permitido"""
        data = {
            'name': 'Nueva Ciudad',
            'latitud': 40.0,
            'longitud': -3.0,
        }
        response = self.client.post('/api/weather/cities/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def test_cities_put_method_not_allowed(self):
        """Verifica que PUT devuelve 405 Método no permitido"""
        data = {'name': 'Madrid Actualizado'}
        response = self.client.put(
            f'/api/weather/cities/{self.madrid.id}/',
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def test_cities_patch_method_not_allowed(self):
        """Verifica que PATCH devuelve 405 Método no permitido"""
        data = {'name': 'Madrid Actualizado'}
        response = self.client.patch(
            f'/api/weather/cities/{self.madrid.id}/',
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def test_cities_delete_method_not_allowed(self):
        """Verifica que DELETE devuelve 405 Método no permitido"""
        response = self.client.delete(f'/api/weather/cities/{self.madrid.id}/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def test_pagination_page_size(self):
        """Verifica que la paginación respeta page_size"""
        response = self.client.get('/api/weather/cities/?page_size=2')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_pagination_second_page(self):
        """Verifica acceso a segunda página si existen suficientes datos"""
        # Crear datos adicionales para verificar paginación
        for i in range(25):
            City.objects.create(
                name=f'Test City {i}',
                latitud=40.0 + i,
                longitud=-3.0 + i,
                comunidad_autonoma='Test'
            )
        
        response = self.client.get('/api/weather/cities/?page_size=5')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que hay más de una página
        self.assertIsNotNone(response.data['next'])
