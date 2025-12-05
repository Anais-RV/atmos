from django.db import models


class City(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Cities"


class WeatherObservation(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="observations")
    timestamp = models.DateTimeField()
    temperature = models.FloatField(help_text="Temperatura en °C")
    condition = models.CharField(
        max_length=100,
        default="Parcialmente nublado",
        help_text="Condición del clima (Soleado, Nublado, Lluvia, etc.)"
    )

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['city', '-timestamp']),
        ]
        verbose_name_plural = "Weather Observations"

    def __str__(self):
        return f"{self.city.name} @ {self.timestamp} -> {self.temperature}ºC"
