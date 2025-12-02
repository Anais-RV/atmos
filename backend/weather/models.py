from django.db import models
from django.utils import timezone

class City(models.Model):
    # Modelo para almacenar ciudades en ubicaciones geográficas
    name = models.CharField(max_length=100)
    latitud = models.FloatField()
    longitud = models.FloatField()
    altitud = models.FloatField(null=True, blank=True, help_text="Metros sobre el nivel del mar")

    def __str__(self):
        return self.name


class WeatherObservation(models.Model):
    # Modelo para observar y almacenar datos meteorológicos
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="observations")
    timestamp = models.DateTimeField(default=timezone.now)

    # Temperatura
    temperature = models.FloatField(help_text="Temperatura en grados Celsius")
    max_temperature = models.FloatField(null=True, blank=True)
    min_temperature = models.FloatField(null=True, blank=True)

    # Humedad y presión
    humidity = models.FloatField(help_text="Humedad relativa en procentaje (0-100)")
    pressure = models.FloatField(help_text="Presión atmosférica en hPa (hectopascal)")

    # Viento
    wind_speed = models.FloatField(help_text="Velocidad del viento en km/h (kilómetros por hora)")
    wind_direction = models.FloatField(help_text="Dirección del viento en grados (0-360)")
    wind_gust = models.FloatField(null=True, blank=True, help_text="Ráfaga máxima de viento en km/h")

    # Precipitación
    precipitation = models.FloatField(default=0, help_text="Precipitación en mm (milímetros)")

    # Otros datos
    visibility = models.FloatField(null=True, blank=True, help_text="Visibilidad en km")
    cloud_cover = models.FloatField(null=True, blank=True, help_text="Porcentaje de cobertura nubosa")

    # Campos calculados (se llenan automáticamente): 
    # 1. Sensación térmica
    # 2. Punto Rocio
    # 3. Índice de calor 
    wind_chill = models.FloatField(null=True, blank=True, editable=False)
    dew_point = models.FloatField(null=True, blank=True, editable=False)
    heat_index = models.FloatField(null=True, blank=True, editable=False)

    def __str__(self):
        return f"{self.city.name} @ {self.timestamp} -> {self.temperature}ºC"


