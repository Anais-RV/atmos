from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        """Initialize MongoEngine connection when Django starts."""
        try:
            from config.mongo_config import init_mongo
            init_mongo()
        except Exception as e:
            import warnings
            warnings.warn(f"Failed to initialize MongoEngine: {e}")
