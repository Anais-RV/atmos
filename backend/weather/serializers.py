# Serializers (DRF)

from rest_framework import serializers
from .models import WeatherObservation

# ✅ Usa ModelSerializer para simplificar
class WeatherObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherObservation
        fields = ['id', 'city', 'temperature', 'max_temperature', 'min_temperature', 
                    'humidity', 'pressure',
                    'wind_speed', 'wind_direction', 'wind_gust',
                    'precipitation', 'visibility',
                    'cloud_cover', 'wind_chill',
                    'dew_point', 'heat_index', 'timestamp']
        read_only_fields = ['id', 'timestamp']
    
    # Validación personalizada
    def validate_temperature(self, value):
        if value < -100 or value > 100:
            raise serializers.ValidationError(
                "Temperatura fuera de rango válido"
            )
        return value