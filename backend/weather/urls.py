# backend/weather/urls.py

from django.urls import path
from .views import ProphetForecastView, CurrentConditionsView

urlpatterns = [
    # Forecast con Prophet
    path(
        "api/weather/prophet/",
        ProphetForecastView.as_view(),
        name="prophet-forecast",
    ),

    # Condiciones actuales + foto emblemática para el dashboard
    path(
        "api/weather/current/",
        CurrentConditionsView.as_view(),
        name="current-conditions",
    ),
]
