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
