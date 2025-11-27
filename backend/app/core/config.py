import os
from typing import Optional


class Settings:
    """
    Configuración básica de la aplicación.
    Lee variables de entorno con valores por defecto.
    """
    
    # Información de la app
    APP_NAME: str = "Atmos"
    APP_VERSION: str = "1.0.0"
    
    # Configuración del servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS - orígenes permitidos
    CORS_ORIGINS: list = [
        "http://localhost:5173",  # Frontend en desarrollo
        "http://localhost:3000",
    ]
    
    # Base de datos (placeholder para futuro)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", None)
    
    # API Keys (placeholder para futuro)
    API_KEY: Optional[str] = os.getenv("API_KEY", None)


settings = Settings()
