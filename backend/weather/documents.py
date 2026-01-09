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

    def wind_chill_calculator(self):
        temp = self.temperature
        wind = self.wind_speed
        if temp is None:
            return None

        # Wind Chill (for temp <= 10°C and wind > 4.8 km/h)
        if temp <= 10 and wind and wind > 4.8:
            wc = 13.12 + 0.6215 * temp - 11.37 * (wind ** 0.16) + 0.3965 * temp * (wind ** 0.16)
            return round(wc, 2)

        # Heat index (for temp >= 27°C)
        elif temp >= 27:
            hi = self.heat_index_calculator()
            return round(hi, 2) if hi is not None else None

        # Otherwise return temperature
        return temp

    def heat_index_calculator(self):
        T = self.temperature
        H = self.humidity
        if T is None or H is None:
            return None
        if T < 27 or H <= 0:
            return None

        hi = -8.78469475556 + 1.61139411 * T + 2.33854883889 * H
        hi += -0.14611605 * T * H + -0.012308094 * (T ** 2)
        hi += -0.0164248277778 * (H ** 2) + 0.002211732 * (T ** 2) * H
        hi += 0.00072546 * T * (H ** 2) + -0.000003582 * (T ** 2) * (H ** 2)

        return round(hi, 2)

    def dew_point_calculator(self):
        T = self.temperature
        H = self.humidity
        if T is None or H is None or H <= 0:
            return None

        a = 17.27
        b = 237.7
        import math
        alpha = ((a * T) / (b + T)) + math.log(H / 100.0)
        dew_point = (b * alpha) / (a - alpha)
        return round(dew_point, 2)

    def wind_direction_in_text(self):
        direcciones = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"
        ]
        if self.wind_direction is None:
            return None
        indice = round(self.wind_direction / 22.5) % 16
        return direcciones[int(indice)]

    def save(self, *args, **kwargs):
        # Update derived fields before saving
        try:
            self.wind_chill = self.wind_chill_calculator()
        except Exception:
            self.wind_chill = None
        try:
            self.dew_point = self.dew_point_calculator()
        except Exception:
            self.dew_point = None
        try:
            if self.temperature is not None and self.temperature >= 27:
                self.heat_index = self.heat_index_calculator()
            else:
                self.heat_index = None
        except Exception:
            self.heat_index = None

        self.updated_at = datetime.utcnow()
        return super(WeatherObservationDocument, self).save(*args, **kwargs)
