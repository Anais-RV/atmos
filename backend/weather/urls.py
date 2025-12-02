from django.urls import path
from .views import ProphetForecastView

app_name = 'weather'

urlpatterns = [
    path("api/forecast/prophet/", ProphetForecastView.as_view(), name="prophet-forecast"),
]
