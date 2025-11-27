# Configuración del Backend Django - Atmos

Esta guía te ayudará a configurar el backend de Atmos con **Django** y **Django REST Framework**.

---

## 📋 Requisitos Previos

- **Python 3.10 o superior**
- **pip** (gestor de paquetes de Python)

### Verificar instalación

```bash
python --version
```

Deberías ver `Python 3.10.x` o superior.

---

## 🚀 Configuración Paso a Paso

### 1. Navegar a la carpeta backend

```bash
cd backend
```

### 2. Crear entorno virtual

#### Windows (PowerShell):

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Si tienes problemas de permisos:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Linux/Mac:

```bash
python3 -m venv venv
source venv/bin/activate
```

Verás `(venv)` al inicio de tu terminal cuando esté activado.

### 3. Instalar dependencias

Con el entorno virtual activado:

```bash
pip install -r requirements.txt
```

Esto instalará:
- Django 5.0
- Django REST Framework
- django-cors-headers (para conectar con el frontend)
- python-decouple (para variables de entorno)
- psycopg2-binary (para PostgreSQL)
- Pillow (para manejo de imágenes)

### 4. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` si necesitas cambiar algo. Por defecto funciona correctamente.

### 5. Inicializar el proyecto Django

**IMPORTANTE**: Este comando crea la estructura base de Django:

```bash
django-admin startproject config .
```

El `.` al final es importante: crea el proyecto en la carpeta actual.

### 6. Configurar CORS

Edita `config/settings.py` y añade:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Apps de terceros
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ← AÑADIR AQUÍ
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Al final del archivo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
]
```

### 7. Aplicar migraciones

```bash
python manage.py migrate
```

Esto crea las tablas base de datos (usuarios, sesiones, etc.).

### 8. Crear superusuario (opcional pero recomendado)

```bash
python manage.py createsuperuser
```

Te pedirá:
- Username
- Email (puedes dejarlo vacío)
- Password

Este usuario te permite acceder al admin de Django.

---

## ▶️ Ejecutar el Servidor

Con todo configurado, ejecuta:

```bash
python manage.py runserver
```

### Salida esperada:

```
System check identified no issues (0 silenced).
November 27, 2025 - 10:00:00
Django version 5.0, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

El servidor estará disponible en: **http://127.0.0.1:8000**

---

## 🧪 Probar que funciona

### 1. Página de bienvenida

Visita: http://127.0.0.1:8000

Deberías ver el cohete de Django.

### 2. Panel de administración

Visita: http://127.0.0.1:8000/admin

Inicia sesión con el superusuario que creaste.

---

## 📱 Crear tu Primera App

Las apps en Django son módulos que hacen **una cosa**. Para Atmos, crearemos una app de datos meteorológicos:

### 1. Crear carpeta para apps

```bash
mkdir apps
```

### 2. Crear app

```bash
python manage.py startapp weather apps/weather
```

### 3. Registrar la app

En `config/settings.py`:

```python
INSTALLED_APPS = [
    ...
    'apps.weather',  # ← AÑADIR
]
```

### 4. Crear modelo de ejemplo

En `apps/weather/models.py`:

```python
from django.db import models

class WeatherData(models.Model):
    temperature = models.FloatField(help_text="Temperatura en °C")
    humidity = models.FloatField(help_text="Humedad en %")
    pressure = models.FloatField(help_text="Presión en hPa")
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Dato Meteorológico"
        verbose_name_plural = "Datos Meteorológicos"
        ordering = ['-recorded_at']
    
    def __str__(self):
        return f"{self.temperature}°C - {self.recorded_at.strftime('%Y-%m-%d %H:%M')}"
```

### 5. Crear migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Registrar en el admin

En `apps/weather/admin.py`:

```python
from django.contrib import admin
from .models import WeatherData

@admin.register(WeatherData)
class WeatherAdmin(admin.ModelAdmin):
    list_display = ['temperature', 'humidity', 'pressure', 'recorded_at']
    list_filter = ['recorded_at']
    date_hierarchy = 'recorded_at'
```

### 7. Ver en el admin

Visita http://127.0.0.1:8000/admin y verás "Datos Meteorológicos" en el panel.

---

## 🔧 Comandos Útiles

```bash
# Ejecutar servidor
python manage.py runserver

# Ejecutar en otro puerto
python manage.py runserver 8001

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ver migraciones pendientes
python manage.py showmigrations

# Abrir shell de Django
python manage.py shell

# Crear superusuario
python manage.py createsuperuser

# Crear nueva app
python manage.py startapp nombre_app

# Ejecutar tests
python manage.py test

# Recoger archivos estáticos
python manage.py collectstatic
```

---

## 🆘 Solución de Problemas

### Error: "No module named 'django'"

**Causa**: Entorno virtual no activado o Django no instalado  
**Solución**:
```bash
# Activa el entorno
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac

# Instala dependencias
pip install -r requirements.txt
```

### Error: "django-admin: command not found"

**Causa**: Django no está instalado  
**Solución**:
```bash
pip install Django
```

### Error: "Table doesn't exist"

**Causa**: No has aplicado las migraciones  
**Solución**:
```bash
python manage.py migrate
```

### Error: "Port is already in use"

**Causa**: El puerto 8000 está ocupado  
**Solución**:
```bash
python manage.py runserver 8001
```

### Error: CORS en el frontend

**Causa**: No configuraste `corsheaders` correctamente  
**Solución**: Revisa el paso 6 de la configuración

### Error: "You have unapplied migrations"

**Causa**: Cambiaste modelos pero no creaste/aplicaste migraciones  
**Solución**:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 📚 Próximos Pasos

1. ✅ Tienes Django funcionando
2. ✅ Tienes el admin configurado
3. ✅ Has creado tu primera app

Ahora:

1. Lee **`docs/django-guide.md`** para entender los conceptos fundamentales
2. Consulta **`docs/best-practices.md`** para buenas prácticas
3. Diseña tus modelos para Atmos
4. Crea serializers y viewsets con DRF
5. Conecta con el frontend

---

## 💡 Consejos

- **Usa el admin de Django** para todo lo que puedas. Es muy potente.
- **Haz migraciones frecuentes**. Pequeños cambios = pequeñas migraciones = menos problemas.
- **Lee los mensajes de error**. Django es muy explicativo.
- **Documenta tus modelos** con `help_text` y docstrings.
- **Consulta la documentación oficial** de Django. Es excelente.

---

**¿Dudas?** Consulta:
- `docs/django-guide.md` para conceptos con analogías
- `docs/best-practices.md` para buenas prácticas
- [Documentación oficial de Django](https://docs.djangoproject.com/)

¡Que vuelen los patos! 🦆☕
