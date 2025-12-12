from django.apps import AppConfig


class WeatherConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'weather'

    def ready(self):
        """
        Registra las señales cuando la aplicación está lista.
        Esto permite que los cambios en WeatherObservation invaliden automáticamente el caché.
        """
        import weather.signals  # noqa
