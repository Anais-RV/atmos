# 🦆 Django para Patos Valientes - Guía Completa

> *"Django es como construir con LEGO. FastAPI es como tallar madera. Ambos son válidos, pero con Django ya tienes muchas piezas hechas."*

Esta guía te enseñará Django desde cero, con analogías que puedas entender y recordar.

---

## 🤔 ¿Por qué Django?

Django es un **framework "baterías incluidas"**. Esto significa que trae:

- ✅ **Panel de administración** automático (gratis, sin programar)
- ✅ **ORM** (hablas con la base de datos en Python, no en SQL)
- ✅ **Sistema de autenticación** ya hecho
- ✅ **Migraciones** automáticas
- ✅ **Formularios** con validación incluida
- ✅ **Sistema de plantillas** para HTML

**Analogía del restaurante:**
- **Django** = Cadena de comida rápida. Todo está estandarizado, las herramientas están listas.
- **FastAPI** = Cocina gourmet. Más libertad, pero tienes que traer tus propios cuchillos.

Ninguna es mejor que la otra. Depende de lo que necesites.

---

## 🏗️ Arquitectura Django: MTV

Django usa el patrón **MTV** (Model-Template-View):

```
┌─────────────┐
│   USUARIO   │
└──────┬──────┘
       │ hace petición HTTP
       ▼
┌─────────────┐
│    URLS     │ ← "¿A dónde va esto?"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    VIEW     │ ← "Aquí está la lógica"
└──┬────────┬─┘
   │        │
   ▼        ▼
┌──────┐ ┌──────────┐
│MODEL │ │ TEMPLATE │ ← "Datos" y "HTML"
└──────┘ └──────────┘
```

**Analogía del restaurante:**

- **URLs** = Carta del menú. Dice qué existe y dónde encontrarlo.
- **View** = Cocinero. Recibe el pedido, prepara la comida (lógica).
- **Model** = Despensa. Aquí están los ingredientes (datos).
- **Template** = Plato servido. La presentación final (HTML).

---

## 🧱 Conceptos Fundamentales

### 1. Proyecto vs Apps

**PROYECTO** = La casa completa  
**APPS** = Las habitaciones de la casa

Un proyecto Django puede tener muchas apps. Cada app hace **una cosa** y la hace bien.

**Ejemplo para Atmos:**
```
Proyecto: atmos_backend
├── App: weather (datos meteorológicos)
├── App: users (usuarios)
├── App: alerts (alertas)
└── App: reports (reportes)
```

**Regla de oro**: Si puedes describirlo en una palabra, debería ser una app.

---

### 2. Models (Modelos)

Los **modelos** son tus tablas de base de datos, pero escritos en Python.

**Analogía**: Son como las fichas de Excel, pero mejor organizadas.

#### Ejemplo simple:

```python
from django.db import models

class WeatherData(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    pressure = models.FloatField()
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Temp: {self.temperature}°C - {self.recorded_at}"
```

**Lo que Django hace por ti:**
- ✅ Crea la tabla en la base de datos automáticamente
- ✅ Te da métodos para leer/escribir datos
- ✅ Valida los tipos de datos
- ✅ Maneja las relaciones entre tablas

#### Tipos de campos comunes:

```python
# Texto
name = models.CharField(max_length=100)        # Texto corto
description = models.TextField()               # Texto largo

# Números
age = models.IntegerField()                    # Número entero
price = models.DecimalField(max_digits=10, decimal_places=2)  # Dinero
rating = models.FloatField()                   # Decimal

# Fechas
created_at = models.DateTimeField(auto_now_add=True)  # Se pone solo al crear
updated_at = models.DateTimeField(auto_now=True)      # Se actualiza solo

# Booleanos
is_active = models.BooleanField(default=True)

# Relaciones
user = models.ForeignKey(User, on_delete=models.CASCADE)  # Uno a muchos
```

**Analogía de relaciones:**

```python
# ForeignKey = "Muchos a uno"
# Como estudiantes en una clase. Muchos estudiantes → Una clase
class Student(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)

# ManyToMany = "Muchos a muchos"
# Como estudiantes y cursos. Un estudiante tiene muchos cursos,
# y un curso tiene muchos estudiantes
class Student(models.Model):
    courses = models.ManyToManyField(Course)
```

---

### 3. Migraciones

Las **migraciones** son como el historial de cambios de tu base de datos.

**Analogía**: Como los commits de Git, pero para la base de datos.

#### Flujo de trabajo:

```bash
# 1. Cambias algo en models.py
# 2. Le dices a Django: "Oye, hay cambios"
python manage.py makemigrations

# 3. Django crea un archivo de migración (como un commit)
# 4. Aplicas los cambios a la BD
python manage.py migrate
```

**Importante**: 
- ❌ NO edites la base de datos directamente
- ✅ Siempre usa migraciones
- ✅ Commitea los archivos de migraciones a Git

---

### 4. Views (Vistas)

Las **vistas** son funciones (o clases) que:
1. Reciben una petición HTTP
2. Hacen algo (consultar BD, procesar datos, etc.)
3. Devuelven una respuesta HTTP

#### Vista simple (Function-Based View):

```python
from django.http import JsonResponse
from .models import WeatherData

def latest_weather(request):
    """Devuelve el último dato meteorológico"""
    latest = WeatherData.objects.latest('recorded_at')
    data = {
        'temperature': latest.temperature,
        'humidity': latest.humidity,
        'recorded_at': latest.recorded_at.isoformat()
    }
    return JsonResponse(data)
```

#### Vista con Django REST Framework:

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def latest_weather(request):
    latest = WeatherData.objects.latest('recorded_at')
    return Response({
        'temperature': latest.temperature,
        'humidity': latest.humidity
    })
```

---

### 5. URLs (Rutas)

Las **URLs** conectan direcciones web con vistas.

**Analogía**: Como un directorio telefónico. Nombre → Número.

#### urls.py del proyecto:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/weather/', include('apps.weather.urls')),
]
```

#### urls.py de la app:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('latest/', views.latest_weather),
    path('history/', views.weather_history),
]
```

**Resultado:**
- `http://localhost:8000/api/weather/latest/` → llama a `latest_weather`
- `http://localhost:8000/api/weather/history/` → llama a `weather_history`

---

### 6. Django REST Framework (DRF)

Si vas a hacer una API (como en Atmos), necesitas **Django REST Framework**.

**Analogía**: Django es el coche, DRF es el turbo que le pones para que vaya más rápido con APIs.

#### Instalación:

```bash 
pip install djangorestframework
```

#### Configuración en settings.py:

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
]
```

#### Serializers (el traductor):

Los **serializers** convierten objetos Python ↔ JSON.

```python
from rest_framework import serializers
from .models import WeatherData

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = ['id', 'temperature', 'humidity', 'pressure', 'recorded_at']
```

**Analogía**: Un serializer es como un traductor. Convierte Python a JSON y viceversa.

#### ViewSets (vistas potentes):

```python
from rest_framework import viewsets
from .models import WeatherData
from .serializers import WeatherSerializer

class WeatherViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherSerializer
```

Con esto, DRF te da **automáticamente**:
- ✅ GET /api/weather/ (listar todos)
- ✅ POST /api/weather/ (crear)
- ✅ GET /api/weather/1/ (ver uno)
- ✅ PUT /api/weather/1/ (actualizar)
- ✅ DELETE /api/weather/1/ (eliminar)

**¡5 endpoints con 4 líneas de código!**

---

## 🎯 Conceptos Que DEBES Tener Claros

### 1. **ORM: Habla Python, no SQL**

```python
# ❌ NO hagas esto:
cursor.execute("SELECT * FROM weather WHERE temp > 25")

# ✅ HAZ esto:
WeatherData.objects.filter(temperature__gt=25)
```

**Queryset básicos:**

```python
# Obtener todos
WeatherData.objects.all()

# Filtrar
WeatherData.objects.filter(temperature__gt=20)

# Obtener uno
WeatherData.objects.get(id=1)

# Crear
WeatherData.objects.create(temperature=22.5, humidity=65)

# Actualizar
data = WeatherData.objects.get(id=1)
data.temperature = 23.0
data.save()

# Eliminar
data.delete()

# Contar
WeatherData.objects.count()

# Ordenar
WeatherData.objects.order_by('-recorded_at')  # Descendente

# Limitar
WeatherData.objects.all()[:10]  # Primeros 10
```

---

### 2. **Migraciones: Tu Base de Datos en el Tiempo**

```bash
# Ver migraciones pendientes
python manage.py showmigrations

# Crear migraciones sin aplicar
python manage.py makemigrations --dry-run

# Deshacer última migración
python manage.py migrate app_name previous_migration

# Ver SQL que genera una migración
python manage.py sqlmigrate app_name 0001
```

**Regla de oro**: Si tocas `models.py`, haz migración.

---

### 3. **Admin: Tu Panel de Control Gratis**

El **admin de Django** es mágico. Solo necesitas:

```python
# admin.py
from django.contrib import admin
from .models import WeatherData

@admin.register(WeatherData)
class WeatherAdmin(admin.ModelAdmin):
    list_display = ['temperature', 'humidity', 'recorded_at']
    list_filter = ['recorded_at']
    search_fields = ['temperature']
```

Visita `http://localhost:8000/admin/` y tendrás un panel completo para gestionar datos.

**Analogía**: Es como tener un WordPress para tus datos, sin programar nada.

---

### 4. **Settings: El Cerebro del Proyecto**

El archivo `settings.py` controla TODO:

```python
# Apps instaladas
INSTALLED_APPS = [...]

# Base de datos
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Zona horaria
TIME_ZONE = 'Europe/Madrid'
USE_TZ = True

# Archivos estáticos
STATIC_URL = '/static/'

# CORS (para el frontend)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

**Importante para Atmos:**

```python
# En settings.py añade:
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    'apps.weather',  # Tu app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Antes de CommonMiddleware
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Tu frontend
]
```

---

## 🚀 Workflow Típico en Django

### Paso 1: Crear una app

```bash
python manage.py startapp weather
```

### Paso 2: Registrar en settings.py

```python
INSTALLED_APPS = [
    ...
    'weather',
]
```

### Paso 3: Definir modelos

```python
# weather/models.py
from django.db import models

class WeatherData(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    recorded_at = models.DateTimeField(auto_now_add=True)
```

### Paso 4: Hacer migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### Paso 5: Crear serializer (si usas DRF)

```python
# weather/serializers.py
from rest_framework import serializers
from .models import WeatherData

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = '__all__'
```

### Paso 6: Crear vista

```python
# weather/views.py
from rest_framework import viewsets
from .models import WeatherData
from .serializers import WeatherSerializer

class WeatherViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherSerializer
```

### Paso 7: Configurar URLs

```python
# weather/urls.py
from rest_framework.routers import DefaultRouter
from .views import WeatherViewSet

router = DefaultRouter()
router.register('data', WeatherViewSet)

urlpatterns = router.urls
```

```python
# config/urls.py
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/weather/', include('weather.urls')),
]
```

### Paso 8: Probar

Visita: `http://localhost:8000/api/weather/data/`

---

## 💡 Consejos de Mamá Pato

### ✅ HACER:

- **Usa el admin** para todo lo que puedas
- **Crea apps pequeñas** (una cosa cada una)
- **Documenta tus modelos** con docstrings
- **Usa el ORM** en lugar de SQL directo
- **Haz migraciones frecuentes** (como commits pequeños)
- **Lee la documentación oficial** de Django (es excelente)

### ❌ EVITAR:

- **No ignores las migraciones** (commitéalas)
- **No uses `objects.get()` sin try/except** (puede fallar)
- **No hardcodees configuración** (usa variables de entorno)
- **No repitas código** (crea funciones helper)
- **No toques la BD sin migraciones**

---

## 🔥 Errores Comunes y Soluciones

### Error: "No such table"
**Causa**: Olvidaste hacer `migrate`  
**Solución**: `python manage.py migrate`

### Error: "No module named 'apps'"
**Causa**: Estructura de carpetas incorrecta  
**Solución**: Verifica que `apps/` tenga `__init__.py`

### Error: CORS en el frontend
**Causa**: No configuraste `django-cors-headers`  
**Solución**: 
```bash
pip install django-cors-headers
# Añade a INSTALLED_APPS y MIDDLEWARE en settings.py
```

### Error: "duplicate key value"
**Causa**: Intentas crear algo que ya existe  
**Solución**: Usa `get_or_create()` en lugar de `create()`

```python
# En lugar de esto:
obj = MyModel.objects.create(name="test")

# Haz esto:
obj, created = MyModel.objects.get_or_create(name="test")
```

---

## 📚 Recursos Recomendados

- **Documentación oficial**: https://docs.djangoproject.com/
- **Django REST Framework**: https://www.django-rest-framework.org/
- **Django Girls Tutorial**: https://tutorial.djangogirls.org/
- **Awesome Django**: https://github.com/wsvincent/awesome-django

---

## 🎓 Siguiente Paso

1. Lee esta guía completamente
2. Configura el backend siguiendo `backend/README.md`
3. Crea tu primera app de prueba
4. Experimenta con el admin de Django
5. Consulta `docs/best-practices.md` para buenas prácticas

---

**Recuerda**: Django no es más difícil que FastAPI, solo es diferente. Es como aprender a conducir coches diferentes. Una vez que entiendes los conceptos, todo fluye.

¡Que vuelen los patos! 🦆☕🔥
