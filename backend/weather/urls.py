# backend/weather/urls.py

from django.urls import path
from .views import (
    CurrentWeatherView,
    ProphetForecastView,
    CurrentConditionsView,
    TimeSeriesView,
    CityListView,
    CityDetailView,
    SunriseSunsetView,
    AlertsListView,
)

urlpatterns = [
    # Endpoints de clima
    path("api/weather/current/", CurrentWeatherView.as_view(), name="current-weather"),
    path("api/weather/forecast/", ProphetForecastView.as_view(), name="prophet-forecast"),
    path("api/weather/conditions/", CurrentConditionsView.as_view(), name="current-conditions"),
    path("api/metrics/timeseries/", TimeSeriesView.as_view(), name="timeseries"),
    path("api/weather/sunrise-sunset/", SunriseSunsetView.as_view(), name="sunrise-sunset"),
    path("api/alerts/", AlertsListView.as_view(), name="alerts-list"),
    
    # Endpoints de ciudades (solo lectura)
    path("api/weather/cities/", CityListView.as_view(), name="cities-list"),
    path("api/weather/cities/<int:pk>/", CityDetailView.as_view(), name="city-detail"),
]
