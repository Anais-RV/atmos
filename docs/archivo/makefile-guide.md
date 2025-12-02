# 🛠️ Guía de Makefile y Scripts de Automatización

## ¿Qué es un Makefile?

Un **Makefile** es como tener una agenda de comandos repetitivos que usas frecuentemente. En lugar de escribir comandos largos una y otra vez, defines atajos cortos que ejecutan esos comandos por ti.

**Analogía del Chef**: Imagina que cocinas un plato complicado cada día. En lugar de leer la receta completa cada vez, escribes "Plato del Día" en tu menú, y al leerlo ya sabes todos los pasos. El Makefile es ese menú.

## ¿Por qué usar Makefiles?

1. **Ahorro de tiempo**: `make dev-backend` es más fácil que `cd backend && python manage.py runserver`
2. **Evitar errores**: Los comandos están escritos correctamente desde el principio
3. **Documentación viva**: El Makefile muestra qué comandos están disponibles
4. **Trabajo en equipo**: Todos usan los mismos comandos

## Estructura de Atmos

Este proyecto incluye **dos formas** de ejecutar comandos:

### 1. Para Linux/Mac - `Makefile`
```bash
make help           # Ver todos los comandos disponibles
make setup-backend  # Configurar backend
make dev-backend    # Ejecutar servidor Django
```

### 2. Para Windows - `scripts.ps1`
```powershell
.\scripts.ps1 help
.\scripts.ps1 setup-backend
.\scripts.ps1 dev-backend
```

## Comandos Disponibles

### Backend

#### `setup-backend` - Configuración Inicial
**Qué hace:**
- Crea el entorno virtual (`venv`)
- Te muestra cómo activarlo
- Te recuerda instalar las dependencias

**Cuándo usarlo:**
- Primera vez que clonas el proyecto
- Después de borrar tu entorno virtual

**Ejemplo:**
```bash
make setup-backend
# Luego:
cd backend
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac
pip install -r requirements.txt
```

#### `dev-backend` - Ejecutar Servidor Django
**Qué hace:**
- Inicia el servidor de desarrollo de Django en `http://localhost:8000`

**Cuándo usarlo:**
- Cada vez que quieras probar el backend
- Mientras desarrollas APIs

**Ejemplo:**
```bash
make dev-backend
# Servidor corriendo en http://localhost:8000
```

#### `migrate` - Aplicar Migraciones
**Qué hace:**
- Ejecuta `python manage.py migrate`
- Sincroniza la base de datos con tus modelos

**Cuándo usarlo:**
- Después de crear nuevas migraciones
- Al clonar el proyecto por primera vez
- Cuando alguien del equipo sube migraciones nuevas

**Ejemplo:**
```bash
make migrate
```

#### `migrations` - Crear Migraciones
**Qué hace:**
- Ejecuta `python manage.py makemigrations`
- Detecta cambios en tus modelos y crea archivos de migración

**Cuándo usarlo:**
- Después de modificar modelos (añadir campos, cambiar tipos, etc.)

**Ejemplo:**
```bash
# Modificaste models.py
make migrations
make migrate  # No olvides aplicarlas después
```

#### `superuser` - Crear Superusuario
**Qué hace:**
- Ejecuta `python manage.py createsuperuser`
- Te permite crear un usuario administrador

**Cuándo usarlo:**
- Primera vez que configuras el proyecto
- Cuando necesitas acceso al panel de admin (`/admin`)

**Ejemplo:**
```bash
make superuser
# Te pedirá: username, email, password
```

### Frontend

#### `setup-frontend` - Configuración Inicial
**Qué hace:**
- Instala todas las dependencias con `pnpm install`

**Cuándo usarlo:**
- Primera vez que clonas el proyecto
- Después de borrar `node_modules`

**Ejemplo:**
```bash
make setup-frontend
```

#### `dev-frontend` - Ejecutar Servidor Vite
**Qué hace:**
- Inicia el servidor de desarrollo de Vite en `http://localhost:5173`

**Cuándo usarlo:**
- Cada vez que quieras ver el frontend
- Mientras desarrollas componentes

**Ejemplo:**
```bash
make dev-frontend
# Servidor corriendo en http://localhost:5173
```

### General

#### `dev` - Ejecutar Todo
**Qué hace:**
- Muestra instrucciones para ejecutar backend y frontend simultáneamente

**Cuándo usarlo:**
- Cuando quieres trabajar en fullstack

**Ejemplo:**
```bash
# Terminal 1
make dev-backend

# Terminal 2 (nueva terminal)
make dev-frontend
```

#### `clean` - Limpiar Archivos Temporales
**Qué hace:**
- Elimina `__pycache__`, `node_modules`, `dist`, `.vite`
- Libera espacio en disco

**Cuándo usarlo:**
- Cuando hay errores extraños (cache corrupto)
- Antes de crear un zip del proyecto
- Cuando quieres empezar "desde cero"

**Ejemplo:**
```bash
make clean
make setup-backend
make setup-frontend
```

## Flujo de Trabajo Típico

### Primera Vez con el Proyecto

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-repo/atmos.git
cd atmos

# 2. Configurar backend
make setup-backend
cd backend
.\venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
cd ..

# 3. Configurar frontend
make setup-frontend

# 4. Ejecutar en desarrollo (dos terminales)
# Terminal 1:
make dev-backend

# Terminal 2:
make dev-frontend
```

### Día a Día de Desarrollo

```bash
# Backend
make dev-backend

# Frontend (otra terminal)
make dev-frontend

# Crear migraciones después de cambios
make migrations
make migrate
```

### Después de Pull de Cambios

```bash
# Si hay cambios en requirements.txt
cd backend
pip install -r requirements.txt

# Si hay nuevas migraciones
make migrate

# Si hay cambios en package.json
cd frontend
pnpm install
```

## 💡 Tips para Crear Tus Propios Comandos

### Anatomía de un Target en Makefile

```makefile
nombre-del-comando:
	@echo "Mensaje informativo"
	comando a ejecutar
```

**Importante:**
- La indentación DEBE ser un **TAB** (no espacios)
- `@echo` muestra mensajes (el `@` oculta el comando mismo)
- Cada línea es un comando independiente

### Ejemplo: Añadir Comando de Tests

```makefile
test-backend:
	@echo "🧪 Ejecutando tests del backend..."
	cd backend && python manage.py test

test-frontend:
	@echo "🧪 Ejecutando tests del frontend..."
	cd frontend && pnpm test
```

### Para PowerShell (`scripts.ps1`)

```powershell
function Test-Backend {
    Write-Host "🧪 Ejecutando tests del backend..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py test
    Set-Location ..
}

# Añadir al switch al final
"test-backend" { Test-Backend }
```

## Comandos Django Útiles (Sin Makefile)

Algunos comandos que puedes añadir o ejecutar directamente:

```bash
# Shell interactiva de Django
python manage.py shell

# Crear nueva app
python manage.py startapp nombre_app

# Ver SQL de migraciones
python manage.py sqlmigrate app_name 0001

# Verificar problemas en el proyecto
python manage.py check

# Crear datos de prueba (si tienes fixtures)
python manage.py loaddata fixtures/data.json

# Exportar datos
python manage.py dumpdata app_name > fixtures/data.json

# Ver rutas disponibles (requiere django-extensions)
python manage.py show_urls
```

## Troubleshooting

### "make: comando no encontrado" en Windows
**Solución**: Usa `.\scripts.ps1` en su lugar

### "no se puede ejecutar scripts en este sistema" (PowerShell)
**Solución**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "comando no funciona desde la raíz del proyecto"
**Solución**: Asegúrate de estar en la carpeta `atmos/` (donde está el Makefile)

### "Tab vs Espacios" en Makefile
**Error común**: Los Makefiles requieren TABS, no espacios
**Solución**: Configura tu editor para usar tabs en archivos Makefile

## 📚 Recursos Adicionales

- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [PowerShell Scripting Guide](https://docs.microsoft.com/en-us/powershell/scripting/)
- [Django Management Commands](https://docs.djangoproject.com/en/stable/ref/django-admin/)

---

**Mamá Pato dice**: "Los Makefiles son como las recetas de cocina. Al principio parecen complicados, pero una vez que los entiendes, no querrás volver a cocinar sin ellos. ¡No tengas miedo de crear tus propios comandos personalizados! 🦆👨‍🍳"
