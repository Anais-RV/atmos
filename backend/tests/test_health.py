from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """
    Test del endpoint /health
    Verifica que responde con status 200 y el JSON esperado.
    """
    response = client.get("/health")
    
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "Atmos backend"


def test_root_endpoint():
    """
    Test del endpoint raíz /
    Verifica que la API responde correctamente.
    """
    response = client.get("/")
    
    assert response.status_code == 200
    
    data = response.json()
    assert "app" in data
    assert "version" in data
    assert data["app"] == "Atmos"
