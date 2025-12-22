from mongoengine import Document, StringField, FloatField, IntField, DateTimeField, ReferenceField
from datetime import datetime


class AlertDocument(Document):
    meta = {'collection': 'alerts', 'indexes': [('user_id', '-created_at')]}
    user_id = IntField(required=True)  # Django User.id
    city_id = IntField(required=True)
    title = StringField(required=True, max_length=255)
    type = StringField(required=True, max_length=50)  # e.g., 'weather_warning', 'temperature_extreme', etc.
    message = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        """Convert document to dict for serialization"""
        return {
            'id': str(self.id),
            'user_id': self.user_id,
            'city_id': self.city_id,
            'title': self.title,
            'type': self.type,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class CityDocument(Document):
    meta = {'collection': 'cities'}
    id = IntField(primary_key=True)
    name = StringField(max_length=200)
    latitud = FloatField()
    longitud = FloatField()
    altitud = FloatField(null=True)
    comunidad_autonoma = StringField(max_length=200, null=True)
    created_at = DateTimeField(default=datetime.utcnow)

    @classmethod
    def get_next_id(cls):
        """Get next auto-incremented ID"""
        # Find the maximum ID  
        all_cities = list(cls.objects.only('id').order_by('-id').limit(1))
        if all_cities:
            return all_cities[0].id + 1
        return 1


class WeatherObservationDocument(Document):
    meta = {'collection': 'weather_observations', 'indexes': [('city_id', 'timestamp')]}
    city_id = IntField(required=True)
    timestamp = DateTimeField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)
    temperature = FloatField(null=True)
    max_temperature = FloatField(null=True)
    min_temperature = FloatField(null=True)
    humidity = FloatField(null=True)
    pressure = FloatField(null=True)
    wind_speed = FloatField(null=True)
    wind_direction = FloatField(null=True)
    wind_gust = FloatField(null=True)
    precipitation = FloatField(null=True)
    visibility = FloatField(null=True)
    cloud_cover = FloatField(null=True)
    wind_chill = FloatField(null=True)
    dew_point = FloatField(null=True)
    heat_index = FloatField(null=True)
