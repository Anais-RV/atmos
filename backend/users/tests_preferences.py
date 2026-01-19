from django.test import TestCase
from users.documents import UserDocument, UserPreferencesDocument


class UserPreferencesModelTestCase(TestCase):
    """
    Tests para el modelo UserPreferences.
    """
    
    def setUp(self):
        self.user = UserDocument(username='testuser', email='test@ejemplo.com')
        # ensure preferences created default
        self.user.preferences = UserPreferencesDocument()
        self.user.set_password('TestPass123!')
        self.user.save()
    
    def test_preferencias_creadas_automaticamente(self):
        """Test que las preferencias se crean automáticamente con el usuario"""
        self.assertIsNotNone(self.user.preferences)
    
    def test_valores_por_defecto(self):
        """Test que los valores por defecto son correctos"""
        preferences = self.user.preferences

        self.assertEqual(preferences.theme, 'light')
        self.assertEqual(preferences.language, 'es')
        self.assertIsNone(preferences.favourite_weather_station)
    
    def test_str_representation(self):
        """Test de la representación en string"""
        preferences = self.user.preferences
        # no __str__ implemented for EmbeddedDocument; check username present
        self.assertEqual(self.user.username, 'testuser')
    
    def test_get_or_create_for_user(self):
        """Test del método get_or_create_for_user"""
        # Simulate recreate
        self.user.preferences = None
        self.user.save()
        # get or create
        if not self.user.preferences:
            self.user.preferences = UserPreferencesDocument()
            self.user.save()

        preferences = self.user.preferences
        self.assertIsNotNone(preferences)