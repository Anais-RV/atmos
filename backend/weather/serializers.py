from rest_framework import serializers
from .models import City, WeatherObservation


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


class WeatherObservationSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField()
    
    class Meta:
        model = WeatherObservation
        fields = ['id', 'city', 'city_name', 'temperature', 'timestamp']
    
    def get_city_name(self, obj):
        return obj.city.name if obj.city else None


class CurrentWeatherSerializer(serializers.Serializer):
    """Serializer para los datos del clima actual"""
    city_id = serializers.IntegerField()
    city_name = serializers.CharField()
    temperature = serializers.FloatField()
    timestamp = serializers.DateTimeField()
    condition = serializers.CharField(required=False)


class TimeSeriesInputSerializer(serializers.Serializer):
    """Serializer para la entrada del endpoint de series temporales"""
    city_id = serializers.IntegerField(
        required=True,
        help_text="ID de la ciudad"
    )
    variable = serializers.CharField(
        required=True,
        max_length=50,
        help_text="Variable meteorológica (temp, humedad, viento, presión)"
    )
    time_range = serializers.CharField(
        required=True,
        max_length=20,
        help_text="Rango temporal (last_1h, last_24h, 7d, 30d, etc.)"
    )
    aggregation = serializers.CharField(
        required=False,
        max_length=20,
        allow_blank=True,
        help_text="Agregación: hourly, daily (auto si no especificado)"
    )


class TimeSeriesDataPointSerializer(serializers.Serializer):
    """Punto de datos individual en una serie temporal"""
    timestamp = serializers.DateTimeField()
    value = serializers.FloatField()


class TimeSeriesMetadataSerializer(serializers.Serializer):
    """Metadatos de una serie temporal"""
    total_points = serializers.IntegerField()
    start_time = serializers.DateTimeField(allow_null=True)
    end_time = serializers.DateTimeField(allow_null=True)
    has_data = serializers.BooleanField()


class TimeSeriesResponseSerializer(serializers.Serializer):
    """
    Respuesta del endpoint de series temporales.
    
    Devuelve datos consistentes y ordenados por timestamp.
    """
    city_id = serializers.IntegerField()
    city_name = serializers.CharField()
    variable = serializers.CharField()
    variable_field = serializers.CharField()
    unit = serializers.CharField()
    time_range = serializers.CharField()
    aggregation = serializers.CharField()
    data = TimeSeriesDataPointSerializer(many=True)
    metadata = TimeSeriesMetadataSerializer()
