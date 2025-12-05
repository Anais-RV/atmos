from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ProphetForecastView

app_name = 'weather'

# ✅ Usa Router para ViewSets
router = DefaultRouter()


urlpatterns = [
    path("api/forecast/prophet/", ProphetForecastView.as_view(), name="prophet-forecast"),
    path('', views.lista_ubicaciones, name='lista_ubicaciones')
]
