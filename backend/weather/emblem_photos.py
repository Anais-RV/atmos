# backend/weather/emblem_photos.py

from dataclasses import dataclass


@dataclass
class EmblemPhoto:
    """
    Representa la foto emblemática seleccionada para el dashboard.
    - code: nombre de archivo o identificador interno (p.ej. "clear_day_city_01.jpg")
    """
    code: str


def select_emblem_photo(condition: str, temp_c: float, is_daytime: bool) -> EmblemPhoto:
    """
    Devuelve la foto emblemática adecuada según:
    - condition: descripción/código del tiempo ("clear", "clouds", "rain", "snow", "storm", etc.)
    - temp_c: temperatura en ºC
    - is_daytime: True si es de día, False si es de noche
    """
    condition = (condition or "").lower().strip()

    # Ola de calor
    if temp_c >= 32:
        return EmblemPhoto(code="heatwave_city_01.jpg")

    # Frío intenso / nieve
    if condition in {"snow", "sleet"} or temp_c <= 0:
        return EmblemPhoto(code="snow_city_01.jpg")

    # Lluvia / llovizna
    if condition in {"rain", "drizzle"}:
        return EmblemPhoto(code="rain_city_01.jpg")

    # Tormentas
    if condition in {"thunderstorm", "storm"}:
        return EmblemPhoto(code="storm_city_01.jpg")

    # Cielo nublado
    if condition in {"clouds", "overcast", "broken clouds", "scattered clouds"}:
        return EmblemPhoto(code="cloudy_city_01.jpg")

    # Despejado día / noche
    if condition in {"clear", ""}:
        if is_daytime:
            return EmblemPhoto(code="clear_day_city_01.jpg")
        return EmblemPhoto(code="clear_night_city_01.jpg")

    # Fallback genérico
    return EmblemPhoto(code="default_city_01.jpg")
