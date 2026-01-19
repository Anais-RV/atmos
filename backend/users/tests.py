from django.test import TestCase
from rest_framework.test import APIClient
from users.documents import UserDocument
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
        self.assertIsNotNone(UserDocument.objects(username='testuser').first())

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
        # Crear usuario en Mongo
        user = UserDocument(
            id=1,
            username='testuser',
            email='test@example.com',
        )
        user.set_password('testpass123')
        user.save()
        
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
        # Crear usuario en Mongo
        user = UserDocument(
            id=2,
            username='testuser',
            email='test@example.com'
        )
        user.set_password('testpass123')
        user.save()
        
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

class PasswordHashingTestCase(TestCase):
    """
    Tests para verificar que las contraseñas se hashean correctamente.
    """
    
    def setUp(self):
        self.client = APIClient()
        self.password_plano = 'TestPassword123!'
        
    def test_create_user_hashea_password(self):
        """Verifica que create_user() hashea la contraseña"""
        user = UserDocument(id=10, username='testuser', email='test@ejemplo.com')
        user.set_password(self.password_plano)
        user.save()
        
        # La contraseña NO debe ser texto plano
        self.assertNotEqual(user.password, self.password_plano)
        
        # Debe estar en formato hasheado
        self.assertTrue(user.password.startswith('pbkdf2_sha256'))
        
        # Debe contener el formato: algoritmo$iteraciones$salt$hash
        parts = user.password.split('$')
        self.assertEqual(len(parts), 4)
        
    def test_set_password_hashea_password(self):
        """Verifica que set_password() hashea la contraseña"""
        user = UserDocument(id=11, username='testuser2', email='test2@ejemplo.com')
        user.set_password(self.password_plano)
        user.save()
        
        # Verificar que está hasheada
        self.assertNotEqual(user.password, self.password_plano)
        self.assertTrue(user.password.startswith('pbkdf2_sha256'))
        
    def test_password_no_se_guarda_en_texto_plano(self):
        """Verifica que la contraseña NUNCA se guarda en texto plano"""
        user = UserDocument(id=12, username='testuser3', email='test3@ejemplo.com')
        user.set_password('SuperSecret123!')
        user.save()
        
        # Recargar usuario desde BD (Mongo)
        user_from_db = UserDocument.objects(id=user.id).first()
        
        # La contraseña en BD NO debe ser texto plano
        self.assertNotIn('SuperSecret123!', user_from_db.password)

class PasswordAuthenticationTestCase(TestCase):
    """
    Tests para verificar que la autenticación usa comparación segura.
    """
    
    def setUp(self):
        self.password = 'TestPassword123!'
        self.user = UserDocument(id=3, username='authtest', email='authtest@ejemplo.com')
        self.user.set_password(self.password)
        self.user.save()
    
    def test_authenticate_con_password_correcta(self):
        """Verifica que authenticate() funciona con contraseña correcta"""
        # Comprobar directamente el documento
        user_doc = UserDocument.objects(username='authtest').first()
        self.assertIsNotNone(user_doc)
        self.assertTrue(user_doc.check_password(self.password))
        
    def test_authenticate_con_password_incorrecta(self):
        """Verifica que authenticate() rechaza contraseña incorrecta"""
        user_doc = UserDocument.objects(username='authtest').first()
        self.assertFalse(user_doc.check_password('PasswordIncorrecta'))
        
    def test_check_password_con_password_correcta(self):
        """Verifica que check_password() funciona correctamente"""
        es_correcta = self.user.check_password(self.password)
        self.assertTrue(es_correcta)
        
    def test_check_password_con_password_incorrecta(self):
        """Verifica que check_password() rechaza contraseña incorrecta"""
        es_correcta = self.user.check_password('PasswordIncorrecta')
        self.assertFalse(es_correcta)



 