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
    # Modelo para observar el cambio climático
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="observations")
    timestamp = models.DateTimeField()
    temperature = models.FloatField()

    def __str__(self):
        return f"{self.city.name} @ {self.timestamp} -> {self.temperature}ºC"
