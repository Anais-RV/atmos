from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Endpoint de salud para verificar que la API está funcionando.
    """
    return {
        "status": "ok",
        "app": "Atmos backend"
    }
