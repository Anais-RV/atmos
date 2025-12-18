from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import UserPreferences

User = get_user_model()


class UserPreferencesModelTestCase(TestCase):
    """
    Tests para el modelo UserPreferences.
    """
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@ejemplo.com',
            password='TestPass123!'
        )
    
    def test_preferencias_creadas_automaticamente(self):
        """Test que las preferencias se crean automáticamente con el usuario"""
        self.assertTrue(hasattr(self.user, 'preferences'))
        self.assertIsNotNone(self.user.preferences)
    
    def test_valores_por_defecto(self):
        """Test que los valores por defecto son correctos"""
        preferences = self.user.preferences
        
        self.assertEqual(preferences.theme, 'light')
        self.assertEqual(preferences.language, 'es')
        self.assertIsNone(preferences.favorite_weather_station)
    
    def test_str_representation(self):
        """Test de la representación en string"""
        preferences = self.user.preferences
        expected = f"Preferencias de {self.user.username}"
        
        self.assertEqual(str(preferences), expected)
    
    def test_get_or_create_for_user(self):
        """Test del método get_or_create_for_user"""
        # Eliminar preferencias existentes
        UserPreferences.objects.filter(user=self.user).delete()
        
        # Crear nuevas preferencias
        preferences = UserPreferences.get_or_create_for_user(self.user)
        
        self.assertIsNotNone(preferences)
        self.assertEqual(preferences.user, self.user)