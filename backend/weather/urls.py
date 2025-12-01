from django.urls import path
from .views import ProphetForecastView

urlpatterns = [
    path("api/forecast/prophet/", ProphetForecastView.as_view(), name="prophet-forecast"),
]
