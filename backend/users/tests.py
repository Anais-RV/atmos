from django.test import TestCase, TransactionTestCase
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
import re


class AuthenticationTests(TestCase):
    """Tests básicos para endpoints de autenticación"""

    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.me_url = '/api/auth/me/'

    def test_user_registration(self):
        """Test: Registro de usuario exitoso"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_user_registration_password_mismatch(self):
        """Test: Registro falla si las contraseñas no coinciden"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'different123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        """Test: Login exitoso con JWT"""
        # Crear usuario
        user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Intentar login
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])

    def test_me_endpoint_requires_authentication(self):
        """Test: Endpoint /me/ requiere autenticación"""
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_with_authentication(self):
        """Test: Endpoint /me/ devuelve datos del usuario autenticado"""
        # Crear usuario y obtener token
        user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        token = login_response.data['tokens']['access']
        
        # Usar token para acceder a /me/
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')

# Test contraseñas seguras

User = get_user_model()

class PasswordHashingTestCase(TestCase):
    """
    Tests para verificar que las contraseñas se hashean correctamente.
    """
    
    def setUp(self):
        self.client = APIClient()
        self.password_plano = 'TestPassword123!'
        
    def test_create_user_hashea_password(self):
        """Verifica que create_user() hashea la contraseña"""
        user = User.objects.create_user(
            username='testuser',
            email='test@ejemplo.com',
            password=self.password_plano
        )
        
        # La contraseña NO debe ser texto plano
        self.assertNotEqual(user.password, self.password_plano)
        
        # Debe estar en formato hasheado
        self.assertTrue(user.password.startswith('pbkdf2_sha256'))
        
        # Debe contener el formato: algoritmo$iteraciones$salt$hash
        parts = user.password.split('$')
        self.assertEqual(len(parts), 4)
        
    def test_set_password_hashea_password(self):
        """Verifica que set_password() hashea la contraseña"""
        user = User(username='testuser2', email='test2@ejemplo.com')
        user.set_password(self.password_plano)
        user.save()
        
        # Verificar que está hasheada
        self.assertNotEqual(user.password, self.password_plano)
        self.assertTrue(user.password.startswith('pbkdf2_sha256'))
        
    def test_password_no_se_guarda_en_texto_plano(self):
        """Verifica que la contraseña NUNCA se guarda en texto plano"""
        user = User.objects.create_user(
            username='testuser3',
            email='test3@ejemplo.com',
            password='SuperSecret123!'
        )
        
        # Recargar usuario desde BD
        user_from_db = User.objects.get(pk=user.pk)
        
        # La contraseña en BD NO debe ser texto plano
        self.assertNotIn('SuperSecret123!', user_from_db.password)

class PasswordAuthenticationTestCase(TestCase):
    """
    Tests para verificar que la autenticación usa comparación segura.
    """
    
    def setUp(self):
        self.password = 'TestPassword123!'
        self.user = User.objects.create_user(
            username='authtest',
            email='authtest@ejemplo.com',
            password=self.password
        )
    
    def test_authenticate_con_password_correcta(self):
        """Verifica que authenticate() funciona con contraseña correcta"""
        user = authenticate(
            username='authtest',
            password=self.password
        )
        
        self.assertIsNotNone(user)
        self.assertEqual(user.username, 'authtest')
        
    def test_authenticate_con_password_incorrecta(self):
        """Verifica que authenticate() rechaza contraseña incorrecta"""
        user = authenticate(
            username='authtest',
            password='PasswordIncorrecta'
        )
        
        self.assertIsNone(user)
        
    def test_check_password_con_password_correcta(self):
        """Verifica que check_password() funciona correctamente"""
        es_correcta = self.user.check_password(self.password)
        self.assertTrue(es_correcta)
        
    def test_check_password_con_password_incorrecta(self):
        """Verifica que check_password() rechaza contraseña incorrecta"""
        es_correcta = self.user.check_password('PasswordIncorrecta')
        self.assertFalse(es_correcta)
 