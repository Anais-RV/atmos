# backend/weather/urls.py

from django.urls import path
from .views import CurrentWeatherView, ProphetForecastView, CurrentConditionsView

urlpatterns = [
    path("api/weather/current/", CurrentWeatherView.as_view(), name="current-weather"),
    path("api/forecast/prophet/", ProphetForecastView.as_view(), name="prophet-forecast"),
    path("api/weather/conditions/", CurrentConditionsView.as_view(), name="current-conditions"),
]

