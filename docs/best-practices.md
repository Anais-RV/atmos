# Guía de Buenas Prácticas - Proyecto Atmos

Esta guía recoge las mejores prácticas para el desarrollo del proyecto Atmos. Léela antes de empezar a programar para mantener la calidad y consistencia del código.

---

## 📦 Gestión de Dependencias

### Usar pnpm

En este proyecto usamos **pnpm** por su velocidad y eficiencia:

```bash
# ✅ Correcto
pnpm install
pnpm add axios

# ❌ Evitar
npm install
yarn add axios
```

### Gestión de paquetes

```bash
# Instalar dependencia de producción
pnpm add nombre-paquete

# Instalar dependencia de desarrollo
pnpm add -D nombre-paquete

# Eliminar dependencia
pnpm remove nombre-paquete

# Actualizar todas las dependencias
pnpm update
```

**Importante**: Siempre commitea el archivo `pnpm-lock.yaml` para garantizar que todo el equipo use las mismas versiones.

---

## ⚛️ Frontend - React + Vite

### Estructura de Componentes

#### ✅ Buenas prácticas

```jsx
// Usa function en lugar de arrow function para componentes
export default function MiComponente() {
  return <div>Contenido</div>
}

// Nombra componentes con PascalCase
export default function UserCard() { }

// Un componente por archivo
// ✅ UserCard.jsx → solo componente UserCard
```

#### ❌ Evitar

```jsx
// ❌ No usar export default con arrow function
export default () => <div>Mal</div>

// ❌ No usar minúsculas en nombres de componentes
export default function usercard() { }

// ❌ No mezclar múltiples componentes en un archivo
```

### Organización de Archivos

```
src/
├── components/
│   ├── layout/          # Componentes de estructura (Navbar, Footer)
│   ├── common/          # Componentes reutilizables (Button, Input)
│   └── features/        # Componentes específicos de funcionalidad
├── pages/               # Páginas completas
├── hooks/               # Custom hooks
├── services/            # Llamadas a API
├── context/             # Context API
├── utils/               # Funciones auxiliares
└── assets/              # Imágenes, iconos
```

### Nombres de Archivos

```bash
# Componentes → PascalCase
UserCard.jsx
DashboardSummary.jsx

# Hooks → camelCase con prefijo 'use'
useAuth.js
useFetch.js

# Utils y servicios → camelCase
apiClient.js
formatDate.js

# Páginas → PascalCase con sufijo 'Page'
DashboardPage.jsx
LoginPage.jsx
```

### Gestión de Estado

```jsx
// ✅ Usa useState para estado local simple
const [count, setCount] = useState(0)

// ✅ Usa useEffect para efectos secundarios
useEffect(() => {
  // Lógica
  return () => {
    // Cleanup
  }
}, [dependencies])

// ✅ Context para estado compartido entre muchos componentes
// Evita prop drilling

// ❌ No abuses de Context para todo
// Solo para datos realmente globales (usuario, tema, idioma)
```

### Llamadas a API

```jsx
// ✅ Usa el cliente centralizado
import { apiClient } from '../services/apiClient'

async function fetchData() {
  try {
    const data = await apiClient('/endpoint')
    setData(data)
  } catch (error) {
    console.error('Error:', error)
    // Maneja el error adecuadamente
  }
}

// ❌ No hagas fetch directo en componentes
// ❌ No dejes errores sin manejar
```

### CSS y Estilos

```jsx
// ✅ Opción 1: CSS Modules (recomendado)
import styles from './Component.module.css'
<div className={styles.container}>

// ✅ Opción 2: Inline styles para casos simples
<div style={{ padding: '1rem' }}>

// ❌ No uses clases globales sin control
// ❌ No mezcles estilos inline con classes sin razón
```

### Renderizado Condicional

```jsx
// ✅ Usa operador ternario para if/else
{isLoading ? <Spinner /> : <Content />}

// ✅ Usa && para renderizado condicional simple
{isVisible && <Component />}

// ✅ Early return para condiciones complejas
if (error) return <ErrorMessage />
if (loading) return <Spinner />
return <Content />
```

### Props y PropTypes

```jsx
// ✅ Desestructura props
function UserCard({ name, email, role }) {
  return <div>{name}</div>
}

// ✅ Valores por defecto
function Button({ text = 'Click', variant = 'primary' }) {
  return <button>{text}</button>
}

// ❌ No uses props sin desestructurar
function UserCard(props) {
  return <div>{props.name}</div>  // Menos claro
}
```

### Performance

```jsx
// ✅ Usa React.memo para componentes que no cambian frecuentemente
export default React.memo(ExpensiveComponent)

// ✅ Usa useMemo para cálculos costosos
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// ✅ Usa useCallback para funciones que se pasan como props
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])

// ❌ No optimices prematuramente
// Solo cuando identifiques un problema real
```

---

## 🐍 Backend - Django + Django REST Framework

### Estructura del Proyecto

```
backend/
├── config/              # Configuración del proyecto Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── weather/         # App de datos meteorológicos
│   │   ├── models.py    # Modelos de BD
│   │   ├── views.py     # Lógica de vistas
│   │   ├── serializers.py  # Serializers DRF
│   │   ├── urls.py      # URLs de la app
│   │   └── admin.py     # Configuración del admin
│   └── core/            # App con funcionalidad compartida
├── tests/               # Tests
├── manage.py
└── requirements.txt
```

### Modelos

#### ✅ Buenas prácticas

```python
from django.db import models

class WeatherData(models.Model):
    # Usa nombres descriptivos
    temperature = models.FloatField(help_text="Temperatura en °C")
    humidity = models.FloatField(help_text="Humedad en %")
    pressure = models.FloatField(help_text="Presión en hPa")
    
    # Timestamps automáticos
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        # Nombres en español para el admin
        verbose_name = "Dato Meteorológico"
        verbose_name_plural = "Datos Meteorológicos"
        # Orden por defecto
        ordering = ['-created_at']
        # Índices para mejorar consultas
        indexes = [
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        # Representación legible
        return f"{self.temperature}°C - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
```

#### ❌ Evitar

```python
# ❌ No uses nombres poco descriptivos
class Data(models.Model):
    t = models.FloatField()  # ¿Qué es t?
    h = models.FloatField()  # ¿Qué es h?

# ❌ No olvides __str__
class WeatherData(models.Model):
    temperature = models.FloatField()
    # Sin __str__ verás "WeatherData object (1)" en el admin

# ❌ No olvides Meta.verbose_name
# El admin mostrará "Weather datas" (inglés + plural mal)
```

### Serializers (DRF)

```python
from rest_framework import serializers
from .models import WeatherData

# ✅ Usa ModelSerializer para simplificar
class WeatherDataSerializer(serializers.ModelSerializer):
    # Campo calculado
    temperature_fahrenheit = serializers.SerializerMethodField()
    
    class Meta:
        model = WeatherData
        fields = ['id', 'temperature', 'humidity', 'pressure', 
                  'temperature_fahrenheit', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_temperature_fahrenheit(self, obj):
        return (obj.temperature * 9/5) + 32
    
    # Validación personalizada
    def validate_temperature(self, value):
        if value < -100 or value > 100:
            raise serializers.ValidationError(
                "Temperatura fuera de rango válido"
            )
        return value

# ✅ Separa serializers de entrada/salida si es necesario
class WeatherDataCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = ['temperature', 'humidity', 'pressure']

class WeatherDataDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = '__all__'
```

### ViewSets y Views

```python
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

# ✅ Usa ViewSets para CRUD completo
class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    
    # Filtros y búsqueda
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['created_at']
    ordering_fields = ['created_at', 'temperature']
    
    # Action personalizada
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Obtiene los últimos 10 registros"""
        latest_data = self.queryset.order_by('-created_at')[:10]
        serializer = self.get_serializer(latest_data, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def average(self, request):
        """Calcula promedios"""
        from django.db.models import Avg
        averages = self.queryset.aggregate(
            avg_temp=Avg('temperature'),
            avg_humidity=Avg('humidity'),
            avg_pressure=Avg('pressure')
        )
        return Response(averages)

# ✅ Usa APIView para casos más simples
from rest_framework.views import APIView

class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"})
```

### URLs

```python
# apps/weather/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeatherDataViewSet

# ✅ Usa Router para ViewSets
router = DefaultRouter()
router.register(r'weather', WeatherDataViewSet, basename='weather')

urlpatterns = [
    path('', include(router.urls)),
]

# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.weather.urls')),  # ✅ Versionado
]
```

### Admin

```python
from django.contrib import admin
from .models import WeatherData

# ✅ Personaliza el admin
@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    # Columnas visibles
    list_display = ['temperature', 'humidity', 'pressure', 'created_at']
    
    # Filtros laterales
    list_filter = ['created_at']
    
    # Campos de búsqueda
    search_fields = ['temperature']
    
    # Ordenamiento por defecto
    ordering = ['-created_at']
    
    # Jerarquía de fechas
    date_hierarchy = 'created_at'
    
    # Campos de solo lectura
    readonly_fields = ['created_at', 'updated_at']
    
    # Organización en fieldsets
    fieldsets = (
        ('Datos Meteorológicos', {
            'fields': ('temperature', 'humidity', 'pressure')
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # Colapsado por defecto
        }),
    )
```

### Migraciones

```python
# ✅ Crea migraciones frecuentemente
python manage.py makemigrations
python manage.py migrate

# ✅ Revisa las migraciones antes de aplicarlas
python manage.py sqlmigrate weather 0001

# ✅ Nombra migraciones personalizadas
python manage.py makemigrations --name add_weather_indexes

# ❌ No edites migraciones después de aplicarlas en producción
# ❌ No borres migraciones que ya están en producción
```

### Querysets y ORM

```python
# ✅ Usa select_related para ForeignKey
users = User.objects.select_related('profile').all()

# ✅ Usa prefetch_related para ManyToMany
posts = Post.objects.prefetch_related('tags').all()

# ✅ Usa filter en lugar de múltiples queries
# Mal:
for data in WeatherData.objects.all():
    if data.temperature > 30:
        print(data)

# Bien:
hot_days = WeatherData.objects.filter(temperature__gt=30)

# ✅ Usa annotate para agregaciones
from django.db.models import Avg, Count

stats = WeatherData.objects.aggregate(
    avg_temp=Avg('temperature'),
    count=Count('id')
)

# ✅ Usa exists() para verificar existencia
if WeatherData.objects.filter(temperature__gt=40).exists():
    # Hay días muy calurosos

# ❌ No hagas esto:
if len(WeatherData.objects.filter(temperature__gt=40)) > 0:  # Carga todos
```

### Configuración (Settings)

```python
# ✅ Usa python-decouple para variables de entorno
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])

# ✅ Configuración de CORS
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Al inicio
    ...
]

CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    cast=lambda v: [s.strip() for s in v.split(',')]
)

# ❌ No hardcodees configuración sensible
SECRET_KEY = 'mi-clave-secreta-123'  # ❌ NUNCA HAGAS ESTO
```

### Testing

```python
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

# ✅ Usa APITestCase para probar APIs
class WeatherAPITestCase(APITestCase):
    def setUp(self):
        # Datos de prueba
        self.weather_data = {
            'temperature': 25.5,
            'humidity': 60.0,
            'pressure': 1013.25
        }
    
    def test_create_weather_data(self):
        response = self.client.post('/api/v1/weather/', self.weather_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(WeatherData.objects.count(), 1)
    
    def test_get_weather_list(self):
        WeatherData.objects.create(**self.weather_data)
        response = self.client.get('/api/v1/weather/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

# ✅ Usa TestCase para probar modelos
class WeatherModelTestCase(TestCase):
    def test_str_representation(self):
        weather = WeatherData.objects.create(
            temperature=25.5,
            humidity=60.0,
            pressure=1013.25
        )
        self.assertIn("25.5°C", str(weather))
```

### Seguridad

```python
# ✅ Usa django-environ o python-decouple
from decouple import config

SECRET_KEY = config('SECRET_KEY')

# ✅ CORS específico
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
]
# ❌ No uses CORS_ALLOW_ALL_ORIGINS = True en producción

# ✅ CSRF protección (activada por defecto)
# Solo desactívala en endpoints de API que usen tokens

# ✅ Hash passwords (automático con User de Django)
from django.contrib.auth.hashers import make_password

password = make_password('mi-contraseña')  # Hasheada automáticamente

# ❌ NUNCA guardes passwords en texto plano
```

### Comandos Personalizados

```python
# apps/weather/management/commands/import_weather.py
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Importa datos meteorológicos'
    
    def add_arguments(self, parser):
        parser.add_argument('file', type=str, help='Archivo CSV')
    
    def handle(self, *args, **options):
        file_path = options['file']
        self.stdout.write(f"Importando desde {file_path}...")
        # Lógica de importación
        self.stdout.write(self.style.SUCCESS('✅ Importación completada'))

# Ejecutar:
# python manage.py import_weather datos.csv
```

---

## 🐍 Python en General

### Estilo de Código

```python
# ✅ Sigue PEP 8
# - 4 espacios de indentación
# - snake_case para funciones y variables
# - PascalCase para clases
# - UPPER_CASE para constantes

# ✅ Usa type hints
def calculate_total(price: float, quantity: int) -> float:
    return price * quantity

# ✅ Usa f-strings para formateo
name = "Usuario"
message = f"Hola {name}"  # ✅
message = "Hola " + name  # ❌

# ✅ Usa list/dict comprehensions cuando sea apropiado
squares = [x**2 for x in range(10)]  # ✅
```

### Imports

```python
# ✅ Orden de imports
# 1. Librerías estándar
import os
from typing import List, Optional

# 2. Librerías de terceros
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# 3. Imports locales
from app.core.config import settings
from app.models.user import User

# ❌ No uses import *
from app.models import *  # ❌
```

---

## 🎯 Consejos Generales

### Commits y Git

```bash
# ✅ Mensajes descriptivos
git commit -m "feat: añade endpoint para obtener datos meteorológicos"
git commit -m "fix: corrige cálculo de promedio de temperatura"
git commit -m "docs: actualiza guía de instalación"

# ❌ Mensajes vagos
git commit -m "cambios"
git commit -m "fix"
```

### Código Limpio

- **DRY (Don't Repeat Yourself)**: No repitas código, extrae funciones comunes
- **KISS (Keep It Simple, Stupid)**: Mantén las soluciones simples
- **YAGNI (You Aren't Gonna Need It)**: No implementes funcionalidad que no necesitas ahora
- **Nombres descriptivos**: Las variables y funciones deben explicarse por sí mismas

### Comentarios

```python
# ✅ Comenta el "por qué", no el "qué"
# Usamos un timeout de 30s porque la API externa es lenta
response = requests.get(url, timeout=30)

# ❌ No comentes lo obvio
# Suma a y b
result = a + b
```

### Testing

- Escribe tests para funcionalidad crítica
- Un test por funcionalidad
- Nombres de tests descriptivos: `test_create_user_with_valid_data`
- Usa `pytest` para el backend

---

## 🚨 Errores Comunes a Evitar

### Frontend

❌ No modifiques el estado directamente
```jsx
// ❌ Mal
state.items.push(newItem)

// ✅ Bien
setItems([...items, newItem])
```

❌ No olvides las dependencias en useEffect
```jsx
// ❌ Mal - puede causar bugs
useEffect(() => {
  fetchData(userId)
}, [])  // Falta userId

// ✅ Bien
useEffect(() => {
  fetchData(userId)
}, [userId])
```

❌ No hagas llamadas API en el render
```jsx
// ❌ Mal
function Component() {
  fetchData()  // Se ejecuta en cada render
  return <div>...</div>
}

// ✅ Bien
function Component() {
  useEffect(() => {
    fetchData()
  }, [])
  return <div>...</div>
}
```

### Backend

❌ No hagas queries en un bucle (N+1 problem)
```python
# ❌ Mal - hace 1 + N queries
posts = Post.objects.all()
for post in posts:
    print(post.author.name)  # Query por cada post

# ✅ Bien - hace 1 query
posts = Post.objects.select_related('author').all()
for post in posts:
    print(post.author.name)
```

❌ No uses filter().count() para verificar existencia
```python
# ❌ Mal - cuenta todos
if WeatherData.objects.filter(temperature__gt=40).count() > 0:
    pass

# ✅ Bien - se detiene en el primero
if WeatherData.objects.filter(temperature__gt=40).exists():
    pass
```

❌ No retornes objetos de modelo directamente desde DRF
```python
# ❌ Mal
class WeatherViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    # Falta serializer_class

# ✅ Bien
class WeatherViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
```

---

## 📚 Recursos Recomendados

### Frontend
- [React Docs (oficial)](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [pnpm Docs](https://pnpm.io/)

### Backend
- [Django Docs (oficial)](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)
- [Django Best Practices](https://django-best-practices.readthedocs.io/)

### General
- [PEP 8 - Python Style Guide](https://pep8.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎓 Conclusión

Estas buenas prácticas no son reglas absolutas, pero seguirlas te ayudará a:

- ✅ Escribir código más limpio y mantenible
- ✅ Evitar bugs comunes
- ✅ Trabajar mejor en equipo
- ✅ Facilitar el code review
- ✅ Hacer el proyecto más profesional

**Recuerda**: Si algo no está claro o tienes dudas, pregunta al equipo. Es mejor preguntar que hacer suposiciones incorrectas.

¡A programar con buenas prácticas! 🚀
