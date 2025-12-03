from django.urls import path
from . import views
from .views import ProphetForecastView

app_name = 'weather'

urlpatterns = [
    path("api/forecast/prophet/", ProphetForecastView.as_view(), name="prophet-forecast"),
    path('', views.lista_ubicaciones, name='lista_ubicaciones'),
    path('ubicacion/<int:ubicacion_id>/', views.detalle_ubicacion, name='detalle_ubicacion'),
    path('comparar/', views.comparar_ubicaciones, name='comparar'),
]
