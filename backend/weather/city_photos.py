# backend/weather/city_photos.py

from dataclasses import dataclass
from typing import Optional

CITY_ID_TO_PHOTO_CODE = {
    1: "barcelona_skyline_01.jpg",
    2: "madrid_skyline_01.jpg",
    3: "paris_skyline_01.jpg",
    4: "london_skyline_01.jpg",
}

CITY_NAME_TO_PHOTO_CODE = {
    "barcelona": "barcelona_skyline_01.jpg",
    "madrid": "madrid_skyline_01.jpg",
    "paris": "paris_skyline_01.jpg",
    "london": "london_skyline_01.jpg",
}


@dataclass
class CityPhoto:
    """
    Representa la foto de la ciudad elegida para el dashboard.
    - code: nombre de archivo (p.ej. "barcelona_skyline_01.jpg")
    """
    code: str


def select_city_photo(
    city_id: Optional[int] = None,
    city_name: Optional[str] = None,
) -> CityPhoto:
    """
    Devuelve la foto de ciudad adecuada según city_id o city_name.
    - Si encuentra match por ID, usa ese.
    - Si no, prueba por nombre (case-insensitive).
    - Si no encuentra nada, devuelve una foto genérica por defecto.
    """
    # 1) Intentar por ID
    if city_id is not None:
        code = CITY_ID_TO_PHOTO_CODE.get(city_id)
        if code:
            return CityPhoto(code=code)

    # 2) Intentar por nombre
    if city_name:
        key = city_name.lower().strip()
        code = CITY_NAME_TO_PHOTO_CODE.get(key)
        if code:
            return CityPhoto(code=code)

    # 3) Fallback genérico
    return CityPhoto(code="default_city_01.jpg")
