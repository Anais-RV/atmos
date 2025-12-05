from django.db import models
from django.utils import timezone
import math

class City(models.Model):
    # Modelo para almacenar ciudades en ubicaciones geográficas
    name = models.CharField(max_length=100)
    latitud = models.FloatField(help_text="Latitud de la ciudad", default=0)
    longitud = models.FloatField(help_text="Longitud de la ciudad", default=0)
    altitud = models.FloatField(null=True, blank=True, help_text="Metros sobre el nivel del mar")

    def __str__(self):
        return self.name


class WeatherObservation(models.Model):
    # Modelo para observar y almacenar datos meteorológicos
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="observations")
    timestamp = models.DateTimeField(default=timezone.now)
    # Actualización en tiemstamp
    updated_at = models.DateTimeField(auto_now=True)

    # Temperatura
    temperature = models.FloatField(help_text="Temperatura en grados Celsius")
    max_temperature = models.FloatField(null=True, blank=True, help_text="Temperatura máxima")
    min_temperature = models.FloatField(null=True, blank=True, help_text="Temperatura mínima")

    # Humedad y presión
    humidity = models.FloatField(help_text="Humedad relativa en procentaje (0-100)", default=0)
    pressure = models.FloatField(help_text="Presión atmosférica en hPa (hectopascal)", default=0)

    # Viento
    wind_speed = models.FloatField(help_text="Velocidad del viento en km/h (kilómetros por hora)", default=0)
    wind_direction = models.FloatField(help_text="Dirección del viento en grados (0-360)", default=0)
    wind_gust = models.FloatField(null=True, blank=True, help_text="Ráfaga máxima de viento en km/h", default=0)

    # Precipitación
    precipitation = models.FloatField(default=0, help_text="Precipitación en mm (milímetros)")

    # Otros datos
    visibility = models.FloatField(null=True, blank=True, help_text="Visibilidad en km", default=0)
    cloud_cover = models.FloatField(null=True, blank=True, help_text="Porcentaje de cobertura nubosa", default=0)

    # Campos calculados (se llenan automáticamente): 
    # 1. Sensación térmica
    # 2. Punto Rocio
    # 3. Índice de calor 
    wind_chill = models.FloatField(null=True, blank=True, editable=False)
    dew_point = models.FloatField(null=True, blank=True, editable=False)
    heat_index = models.FloatField(null=True, blank=True, editable=False)

    # class Meta: clase especial que proporciona metadatos para personalizar su comportamiento
    
    class Meta:
        # Nombres en español para el admin
        verbose_name = "Observación Meteorológica"
        verbose_name_plural = "Observaciones Meteorológicas"
        # Orden por defecto
        ordering = ['-timestamp']
        # Índices para mejorar consultas
        indexes = [
            models.Index(fields=['-timestamp']),
        ]
    

    def __str__(self):
        return f"{self.city.name} @ {self.timestamp.strftime('%Y-%m-%d %H:%M')} -> {self.temperature}ºC | Sensación térmica: {self.wind_chill} | Punto rocío: {self.dew_point} | Índice de calor: {self.heat_index}"


    def wind_chill_calculator(self):
        """
        Calcula la sensación térmica según las condiciones:
        - Wind Chill para temperaturas frías con viento
        - Índice de Calor para temperaturas altas con humedad
        """
        temp = self.temperature
        wind = self.wind_speed

        # Wind Chill (para temp <= 10°C y viento > 4.8 km/h)
        if temp <= 10 and wind > 4.8:
            wc = 13.12 + 0.6215 * temp - 11.37 * (wind ** 0.16) + 0.3965 * temp * (wind ** 0.16)
            return round(wc, 2)
        
        # Índice de Calor (para temp >= 27°C)
        elif temp >= 27:
            hi = self.heat_index_calculator()
            return round(hi, 2)
        
        # Si no aplica ninguna fórmula, la sensación térmica es igual a la temperatura
        return temp
    
    def heat_index_calculator(self):
        """
        Calcula el índice de calor (Heat Index) usando la fórmula de Steadman
        """
        T = self.temperature
        H = self.humidity

        # Solo calcular si la temperatura y humedad son adecuadas
        if T < 27 or H <= 0:
            return None

        # Fórmula simplificada del Heat Index
        hi = -8.78469475556 + 1.61139411 * T + 2.33854883889 * H
        hi += -0.14611605 * T * H + -0.012308094 * (T ** 2)
        hi += -0.0164248277778 * (H ** 2) + 0.002211732 * (T ** 2) * H
        hi += 0.00072546 * T * (H ** 2) + -0.000003582 * (T ** 2) * (H ** 2)

        return round(hi, 2)

    def dew_point_calculator(self):
        """
        Calcula el punto de rocío usando la fórmula de Magnus-Tetens
        """
        T = self.temperature
        H = self.humidity

        # Evitar errores matemáticos si la humedad es 0 o muy baja
        if H <= 0:
            return None

        a = 17.27
        b = 237.7
        
        alpha = ((a * T) / (b + T)) + math.log(H / 100.0)
        dew_point = (b * alpha) / (a - alpha)

        return round(dew_point, 2)
                        
    def wind_direction_in_text(self):
        """
        Convierte los grados de dirección del viento a texto
        """
        direcciones = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"
        ]
        indice = round(self.wind_direction / 22.5) % 16
        return direcciones[indice]
    
    def save(self, *args, **kwargs):
        """
        Sobrescribe el método save para calcular automáticamente los campos derivados
        """
        # Calcular sensación térmica
        self.wind_chill = self.wind_chill_calculator()
        
        # Calcular punto de rocío
        self.dew_point = self.dew_point_calculator()
        
        # Calcular índice de calor si aplica
        if self.temperature >= 27:
            self.heat_index = self.heat_index_calculator()
        
        super().save(*args, **kwargs)