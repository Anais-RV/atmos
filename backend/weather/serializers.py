from rest_framework import serializers


class CitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    latitud = serializers.FloatField()
    longitud = serializers.FloatField()
    altitud = serializers.FloatField(allow_null=True)
    comunidad_autonoma = serializers.CharField(allow_null=True)


class WeatherObservationSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    city_id = serializers.IntegerField()
    city_name = serializers.CharField(required=False, allow_null=True)
    temperature = serializers.FloatField(allow_null=True)
    timestamp = serializers.DateTimeField()


class CurrentWeatherSerializer(serializers.Serializer):
    """Serializer para los datos del clima actual"""
    city_id = serializers.IntegerField()
    city_name = serializers.CharField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField(required=False)
    wind_speed = serializers.FloatField(required=False)
    timestamp = serializers.DateTimeField()
    condition = serializers.CharField(required=False)
    sunrise = serializers.DateTimeField(required=False)
    sunset = serializers.DateTimeField(required=False)
    daylight_duration = serializers.FloatField(required=False)
    sunrise_formatted = serializers.CharField(required=False)
    sunset_formatted = serializers.CharField(required=False)
    daylight_duration_formatted = serializers.CharField(required=False)


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
