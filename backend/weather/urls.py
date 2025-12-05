# backend/weather/urls.py

from django.urls import path
from .views import ProphetForecastView, CurrentConditionsView

urlpatterns = [
  # Forecast con Prophet
  path(
      "api/forecast/prophet/",
      ProphetForecastView.as_view(),
      name="prophet-forecast",
  ),

  # Condiciones actuales + fotos (emblemática + ciudad elegida)
  path(
      "api/weather/current/",
      CurrentConditionsView.as_view(),
      name="current-conditions",
  ),
]
