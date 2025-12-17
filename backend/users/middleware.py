from django.core.cache import cache
from django.http import JsonResponse

class PasswordResetRateLimitMiddleware:
    """
    Middleware para limitar intentos de recuperación de contraseña.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == "/api/auth/password-reset/request/" and request.method == "POST":
            # Obtener IP del cliente
            ip = self.get_client_ip(request)
            cache_key = f"password_reset_attempts_{ip}"

            # Obetener número de intentos
            attempts = cache.get(cache_key, 0)

            # Límite: 3 intentos por hora
            if attempts >= 3:
                return JsonResponse({
                    "success": False,
                    "error": "Fin de límite de intentos",
                    "detail": "Has excedido el límite de intentos. Intente de nuevo más tarde (Tiempo máximo: 1 hora)."
                }, status=429)
            
            # Incrementar intentos
            cache.set(cache_key, attempts + 1, 3600) # 1 hora

        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip