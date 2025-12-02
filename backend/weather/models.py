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

    def __str__(self):
        return f"{self.city.name} @ {self.timestamp} -> {self.temperature}ºC"


