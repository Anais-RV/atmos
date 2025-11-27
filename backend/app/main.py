from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import health

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API backend para el proyecto Atmos - Sistema de gestión de datos meteorológicos"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(health.router, tags=["Health"])


@app.get("/")
async def root():
    """
    Endpoint raíz de la API.
    """
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "message": "Bienvenido a la API de Atmos"
    }
