from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth JWT: refresh token
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Rutas de autenticación (registro, login, me, admin-only)
    path("api/auth/", include("users.urls")),

    # Weather Prophet forecasts
    path("", include("weather.urls")),
]
