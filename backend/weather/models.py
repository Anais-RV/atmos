from django.db import models


class City(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class WeatherObservation(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="observations")
    timestamp = models.DateTimeField()
    temperature = models.FloatField()

    def __str__(self):
        return f"{self.city.name} @ {self.timestamp} -> {self.temperature}ºC"
