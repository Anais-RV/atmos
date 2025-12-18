# throttles.py

from rest_framework.throttling import UserRateThrottle

class PreferencesRateThrottle(UserRateThrottle):
    """
    Limita las peticiones de preferencias a 100 por hora por usuario.
    """
    rate = "100/hour"