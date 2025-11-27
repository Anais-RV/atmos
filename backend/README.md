# Backend - Atmos

Backend API construido con **FastAPI** para el proyecto Atmos.

## Requisitos

- Python 3.10 o superior
- pip (gestor de paquetes de Python)

## Configuración inicial

### 1. Crear y activar entorno virtual

Es importante trabajar en un entorno virtual para aislar las dependencias del proyecto.

#### En Windows (PowerShell):

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### En Linux/Mac:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

Con el entorno virtual activado, instala las dependencias:

```bash
pip install -e .
```

Para desarrollo (incluye pytest):

```bash
pip install -e ".[dev]"
```

## Ejecutar el servidor

Con el entorno virtual activado, ejecuta:

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en: **http://localhost:8000**

### Endpoints disponibles

- `GET /` - Información básica de la API
- `GET /health` - Comprobación de salud de la API
- `GET /docs` - Documentación interactiva (Swagger UI)
- `GET /redoc` - Documentación alternativa (ReDoc)

## Ejecutar los tests

Con el entorno virtual activado:

```bash
pytest
```

Para ver más detalles:

```bash
pytest -v
```

## Estructura del proyecto

```
backend/
├── app/
│   ├── api/
│   │   └── v1/              # Endpoints de la versión 1 de la API
│   │       ├── health.py    # Endpoint /health
│   │       └── __init__.py
│   ├── core/
│   │   └── config.py        # Configuración de la aplicación
│   ├── models/              # Modelos de base de datos (futuro)
│   ├── schemas/             # Esquemas Pydantic (futuro)
│   ├── services/            # Lógica de negocio (futuro)
│   └── main.py              # Punto de entrada de la aplicación
├── tests/
│   └── test_health.py       # Tests de ejemplo
├── pyproject.toml           # Configuración y dependencias
└── README.md
```

## Próximos pasos

Este es el esqueleto inicial. A partir de aquí se implementará:

- Conexión a base de datos
- Autenticación y autorización
- Endpoints para datos meteorológicos
- Modelos y schemas específicos del dominio
- Servicios de lógica de negocio

## Notas

- El servidor usa el flag `--reload` para recargarse automáticamente cuando detecta cambios en el código.
- La configuración CORS está activada para permitir peticiones desde el frontend en desarrollo.
- Las variables de entorno se pueden configurar creando un archivo `.env` en la raíz del backend.
- **Consulta `docs/best-practices.md`** para guía de buenas prácticas con FastAPI y evitar usar Django innecesariamente.
