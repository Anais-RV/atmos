# Configuración del Backend - Atmos

Esta guía te ayudará a poner en marcha el backend de Atmos, construido con **FastAPI**.

## Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- **Python 3.10 o superior**
- **pip** (gestor de paquetes de Python)

### Verificar instalación

Abre una terminal y ejecuta:

```bash
python --version
```

Deberías ver algo como `Python 3.10.x` o superior.

---

## Pasos para configurar el backend

### 1. Navega a la carpeta del backend

Desde la raíz del proyecto:

```bash
cd backend
```

### 2. Crea un entorno virtual

Es importante usar un entorno virtual para aislar las dependencias del proyecto.

#### En Windows (PowerShell):

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Si tienes problemas de permisos, ejecuta esto primero:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### En Linux/Mac:

```bash
python3 -m venv venv
source venv/bin/activate
```

Cuando el entorno esté activado, verás `(venv)` al inicio de tu línea de comandos.

### 3. Instala las dependencias

Con el entorno virtual activado:

```bash
pip install -e .
```

Para incluir las dependencias de desarrollo (necesarias para ejecutar tests):

```bash
pip install -e ".[dev]"
```

Esto instalará:
- FastAPI
- Uvicorn (servidor ASGI)
- Pytest (para tests)
- Y otras dependencias necesarias

---

## Ejecutar el servidor

Con el entorno virtual activado y las dependencias instaladas, ejecuta:

```bash
uvicorn app.main:app --reload
```

### Explicación del comando:

- `app.main:app` → carga la instancia FastAPI desde `app/main.py`
- `--reload` → recarga automáticamente el servidor cuando detecta cambios en el código

### Salida esperada:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

El servidor estará disponible en: **http://localhost:8000**

---

## Probar que funciona

### 1. Endpoint raíz

Abre tu navegador y visita:

```
http://localhost:8000
```

Deberías ver un JSON como:

```json
{
  "app": "Atmos",
  "version": "1.0.0",
  "message": "Bienvenido a la API de Atmos"
}
```

### 2. Endpoint de salud

Visita:

```
http://localhost:8000/health
```

Deberías ver:

```json
{
  "status": "ok",
  "app": "Atmos backend"
}
```

### 3. Documentación interactiva

FastAPI genera documentación automática. Visita:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Aquí puedes ver todos los endpoints disponibles y probarlos directamente desde el navegador.

---

## Ejecutar los tests

Con el entorno virtual activado:

```bash
pytest
```

### Ver más detalles:

```bash
pytest -v
```

### Salida esperada:

```
tests/test_health.py::test_health_endpoint PASSED
tests/test_health.py::test_root_endpoint PASSED

====== 2 passed in 0.15s ======
```

---

## Detener el servidor

Para detener el servidor, presiona `Ctrl + C` en la terminal donde está corriendo.

---

## Desactivar el entorno virtual

Cuando termines de trabajar:

```bash
deactivate
```

---

## Estructura del backend

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── health.py        # Endpoints de salud
│   │       └── __init__.py
│   ├── core/
│   │   └── config.py            # Configuración de la app
│   ├── models/                  # Modelos de BD (futuro)
│   ├── schemas/                 # Schemas Pydantic (futuro)
│   ├── services/                # Lógica de negocio (futuro)
│   └── main.py                  # Punto de entrada
├── tests/
│   └── test_health.py           # Tests de ejemplo
├── pyproject.toml               # Configuración y dependencias
└── README.md
```

---

## Próximos pasos

Una vez que tengas el backend funcionando, el siguiente paso es:

1. Conectar una base de datos
2. Implementar endpoints para datos meteorológicos
3. Añadir autenticación con JWT
4. Crear modelos y schemas
5. Implementar lógica de negocio en services

---

## Solución de problemas

### Error: "python no se reconoce como comando"

Asegúrate de tener Python instalado y añadido al PATH del sistema.

### Error: "No module named 'fastapi'"

Verifica que:
1. El entorno virtual esté activado (debe aparecer `(venv)`)
2. Hayas ejecutado `pip install -e .`

### El servidor no recarga automáticamente

Asegúrate de usar el flag `--reload`:

```bash
uvicorn app.main:app --reload
```

### Puerto 8000 ya en uso

Si el puerto está ocupado, puedes usar otro:

```bash
uvicorn app.main:app --reload --port 8001
```

Recuerda actualizar la URL en el frontend si cambias el puerto.

---

## Consejos

- **Mantén el entorno virtual activado** mientras trabajas en el backend.
- **Usa `--reload`** durante el desarrollo para ver cambios automáticamente.
- **Revisa los logs** en la terminal si algo no funciona.
- **Ejecuta los tests** después de hacer cambios para asegurar que todo funciona.
- **Consulta la documentación** en `/docs` para ver los endpoints disponibles.

---

¡Listo! Ya tienes el backend de Atmos funcionando. 🚀
