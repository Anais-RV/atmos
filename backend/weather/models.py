"""
Compatibility layer: expose names `City` and `WeatherObservation` backed by
MongoEngine document classes so other modules importing `weather.models`
continue to work when the project is running in MongoDB-only mode.
"""

from .documents import CityDocument as City, WeatherObservationDocument as WeatherObservation