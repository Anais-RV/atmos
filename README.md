# Atmos - Sistema Meteorológico

Sistema fullstack completo para gestión, visualización y análisis de datos meteorológicos con autenticación de usuarios, preferencias personalizadas y predicciones avanzadas.

---

## 🚀 Inicio Rápido

```bash
# 1. Clonar
git clone https://github.com/Anais-RV/atmos.git
cd atmos

# 2. OPCIÓN RECOMENDADA: Menú interactivo con HUD y Logging
./menu.sh               # Linux/Mac
.\menu.ps1              # Windows

# El menú te presenta opciones como:
# ⚙ Backend        → Setup, ejecutar Django, migraciones, etc.
# 🎨 Frontend      → Setup, ejecutar Vite, detener servidor
# 🛠 Git           → Ramas, commits, PRs, análisis de conflictos
# 👨‍🏫 Profes        → Sincronizar dev/main, merges especializados
# 🧰 Utilidades    → Limpiar archivos temporales, ayuda
```

**¡Listo!**  
- Backend: http://127.0.0.1:8000  
- Frontend: http://localhost:5173

---

### 📋 Comandos Disponibles

**Backend - Setup e Inicialización**
```bash
./menu.sh setup-backend    # Linux/Mac
.\menu.ps1 setup-backend   # Windows
```
Crea venv e instala dependencias del backend

**Backend - Servidor Django**
```bash
./menu.sh dev-backend      # Iniciar servidor
.\menu.ps1 dev-backend     # Windows

./menu.sh stop-django      # Detener servidor
.\menu.ps1 stop-django     # Windows
```

**Backend - Migraciones**
```bash
./menu.sh migrate          # Aplicar migraciones a BD
.\menu.ps1 migrate

./menu.sh migrations       # Crear nuevas migraciones
.\menu.ps1 migrations
```

**Backend - Utilidades**
```bash
./menu.sh virtual          # Activar entorno virtual
.\menu.ps1 virtual

./menu.sh superuser        # Crear superusuario
.\menu.ps1 superuser
```

**Frontend - Setup**
```bash
./menu.sh setup-frontend   # Instalar dependencias con pnpm
.\menu.ps1 setup-frontend
```

**Frontend - Servidor Vite**
```bash
./menu.sh dev-frontend     # Iniciar servidor
.\menu.ps1 dev-frontend

./menu.sh stop-vite        # Detener servidor
.\menu.ps1 stop-vite
```

**Git - Flujo de Trabajo**
```bash
./menu.sh create-branch    # Crear rama desde dev
.\menu.ps1 create-branch

./menu.sh pull-dev         # Traer cambios de dev a rama actual
.\menu.ps1 pull-dev

./menu.sh quick-push       # Push rápido (add + commit + push)
.\menu.ps1 quick-push

./menu.sh create-pr        # Crear Pull Request automático
.\menu.ps1 create-pr

./menu.sh anti-conflict    # Analizar posibles conflictos
.\menu.ps1 anti-conflict
```

**Profes - Sincronización**
```bash
./menu.sh sync-dev-main    # Sincronizar dev con main
.\menu.ps1 sync-dev-main

./menu.sh merge-root-dev   # Merge desde raíz a dev
.\menu.ps1 merge-root-dev
```

**Utilidades**
```bash
./menu.sh clean            # Limpiar archivos temporales
.\menu.ps1 clean

./menu.sh help             # Mostrar todos los comandos
.\menu.ps1 help
```

---

## 📚 Documentación

**📘 Empieza aquí** → **[docs/00_INDEX.md](./docs/00_INDEX.md)**

El índice te guía paso a paso:
1. Setup inicial
2. Cómo contribuir
3. Solución de problemas

**✅ ¿Todo instalado?** → **[VERIFICAR.md](./VERIFICAR.md)** - Checklist para comprobar que funciona

**Empieza por ahí** → no necesitas leer nada más.

---

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: Django 5.1 + Django REST Framework 3.16.1
- **Autenticación**: JWT (djangorestframework-simplejwt 5.5.1)
- **Base de Datos**: SQLite (desarrollo) + MongoDB (producción con mongoengine 0.29.1)
- **Predicciones**: Facebook Prophet 1.1.6
- **APIs Externas**: AEMET API integration
- **Testing**: pytest 9.0.2 + pytest-django 4.11.1
- **CORS**: django-cors-headers 4.9.0

### Frontend
- **Framework**: React 19.2.1 + Vite 7.2.7
- **Ruteo**: React Router DOM 7.10.1
- **Estilos**: styled-components 6.1.19
- **Gráficos**: Chart.js 4.5.1 + react-chartjs-2 5.3.1
- **Iconos**: Lucide React 0.558.0
- **Gestor de paquetes**: pnpm 10.25.0

### Dependencias Clave
- `pandas`: Manipulación de series temporales
- `numpy`: Cálculos numéricos
- `requests`: Llamadas HTTP
- `Pillow`: Procesamiento de imágenes
- `astral`: Cálculos de amanecer/atardecer
- `dnspython`: Resolución DNS para MongoDB

---

## 📋 Características Principales

### Autenticación & Usuarios
- **Registro de usuarios** con validación de contraseñas
- **Login seguro** con JWT tokens
- **Recuperación de contraseña** por email
- **Perfil de usuario** con gestión de datos personales
- **Cambio de contraseña** con verificación de contraseña actual

### Datos Meteorológicos
- **Clima actual** - Observaciones en tiempo real por ciudad
- **Series temporales** - Histórico de observaciones meteorológicas
- **Predicciones** - Pronósticos a corto plazo (24-48 horas)
- **Predicciones extendidas** - Análisis a largo plazo con Prophet
- **Gráficos interactivos** - Visualización de datos con Chart.js
- **Información solar** - Horarios de amanecer/atardecer

### Preferencias & Personalizacion
- **Ciudades favoritas** - Gestión de ubicaciones de interés
- **Preferencias de usuario** - Unidades, temperatura, idioma
- **Sistema de etiquetas** - Categorización personalizada de observaciones
- **Alertas** - Sistema de alertas persistentes por usuario (MongoDB)
- **Tema claro/oscuro** - Modo día/noche
- **Multiidioma** - Soporte para múltiples idiomas

---

## 🏗️ Arquitectura

### Backend (Django)
```
backend/
├── config/               # Configuración central
│   ├── settings.py      # Django settings
│   ├── urls.py          # Ruteo principal
│   ├── mongo_config.py  # Configuración MongoDB
│   └── wsgi.py
├── users/               # Módulo de autenticación
│   ├── views.py         # Vistas (Register, Login, Profile, etc)
│   ├── serializers.py   # Serializadores
│   ├── models.py        # Modelos Django
│   ├── documents.py     # Documentos MongoDB
│   ├── permissions.py   # Permisos personalizados
│   ├── auth_backends.py # Backends de autenticación
│   └── urls.py          # Rutas de usuarios
├── weather/             # Módulo meteorológico
│   ├── views.py         # Vistas (Weather, Forecast, Alerts, etc)
│   ├── serializers.py   # Serializadores
│   ├── models.py        # Modelos Django
│   ├── documents.py     # Documentos MongoDB
│   ├── prophet_service.py    # Servicio de predicciones
│   ├── cache_service.py      # Caché de datos
│   ├── time_series_service.py # Series temporales
│   ├── aemet_service.py       # Integración AEMET
│   ├── sunrise_sunset.py      # Cálculos solares
│   └── urls.py               # Rutas de clima
├── scripts/             # Scripts de utilidad
├── manage.py            # CLI de Django
└── requirements.txt     # Dependencias Python
```

### Frontend (React)
```
frontend/src/
├── App.jsx              # Componente raíz
├── index.css            # Estilos globales
├── main.jsx             # Punto de entrada
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── auth/            # Formularios de login/registro
│   ├── features/        # Funcionalidades principales
│   └── ui/              # Componentes UI genéricos
├── pages/               # Páginas principales
│   ├── DashboardPage    # Dashboard principal
│   ├── LoginPage        # Autenticación
│   ├── RegisterPage     # Registro
│   ├── UserPanelPage    # Panel de usuario
│   ├── ForecastPage     # Predicciones
│   ├── ForecastChartPage # Gráficos de predicción
│   ├── ForecastExtendedPage # Predicciones extendidas
│   ├── WeatherHistoryPage   # Histórico de observaciones
│   ├── SettingsPage         # Configuración
│   ├── TagsPage             # Gestión de etiquetas
│   └── PasswordResetPage    # Recuperación de contraseña
├── services/            # Servicios HTTP
│   ├── apiClient.js     # Cliente API centralizado
│   ├── authService.js   # Autenticación
│   ├── preferencesService.js # Preferencias
│   ├── tagsService.js   # Etiquetas
│   └── languagesService.js   # Idiomas
├── context/             # Context API
│   ├── ThemeContext     # Tema claro/oscuro
│   ├── PreferencesContext # Preferencias de usuario
│   └── LanguageContext  # Idioma
└── styles/              # Estilos CSS
```

---

## 🔌 Endpoints Principales de la API

### Autenticación
- `POST /api/users/register/` - Registro de usuario
- `POST /api/users/login/` - Login
- `POST /api/users/logout/` - Logout
- `POST /api/users/refresh/` - Refrescar JWT token
- `GET /api/users/me/` - Perfil del usuario autenticado
- `PUT/PATCH /api/users/profile/` - Actualizar perfil
- `POST /api/users/change-password/` - Cambiar contraseña
- `POST /api/users/password-reset/` - Solicitar reset de contraseña

### Datos Meteorológicos
- `GET /api/weather/current/` - Clima actual de una ciudad
- `GET /api/weather/timeseries/` - Serie temporal de observaciones
- `GET /api/weather/forecast/` - Pronóstico corto plazo
- `GET /api/weather/forecast-extended/` - Pronóstico extendido (Prophet)
- `GET /api/weather/sunrise-sunset/` - Horarios solares

### Preferencias & Personalización
- `GET /api/users/preferences/` - Preferencias del usuario
- `PUT/PATCH /api/users/preferences/` - Actualizar preferencias
- `GET /api/tags/` - Lista de etiquetas
- `POST /api/tags/` - Crear etiqueta
- `DELETE /api/tags/<id>/` - Eliminar etiqueta

### Alertas
- `GET /api/alerts/` - Lista de alertas del usuario
- `POST /api/alerts/` - Crear nueva alerta
- `DELETE /api/alerts/<id>/` - Eliminar alerta

---

## 🗄️ Modelos de Datos

### Usuario (Django)
```python
User (Django built-in)
├── id
├── username
├── email
├── password (hashed)
├── first_name
├── last_name
└── is_active

UserPreferences (MongoDB)
├── user_id
├── temperature_unit     # C, F, K
├── language             # es, en, fr, etc
├── theme               # light, dark
├── favorite_cities     # Array de city_ids
└── updated_at
```

### Observación Meteorológica (MongoDB)
```python
WeatherObservation
├── city_id
├── date
├── temperature
├── humidity
├── wind_speed
├── precipitation
├── pressure
├── uv_index
└── created_at
```

### Alerta (MongoDB)
```python
Alert
├── user_id             # Usuario propietario
├── city_id             # Ciudad afectada
├── title
├── type               # warning, info, danger
├── message
├── created_at
└── updated_at
```

---

## 🧪 Testing

### Backend
```bash
# Ejecutar todos los tests
pytest

# Tests específicos
pytest backend/test_alerts.py -v

# Con cobertura
pytest --cov=backend
```

### Datos de Prueba
```bash
# Semillar alertas de prueba
python manage.py seed_alerts

# Usuario de prueba
Username: testuser
Password: testpass123
```

---

## 🔐 Seguridad

- **JWT Tokens**: Autenticación stateless con expiración configurable
- **CORS**: Configuración segura de orígenes permitidos
- **Permisos**: Basados en clase con validación por endpoint
- **Validación**: Serializers de DRF con validación de entrada
- **Contraseñas**: Hashing seguro con Django
- **MongoDB**: Índices compuestos para queries eficientes
- **Aislamiento de datos**: Filtrado por usuario_id en todas las queries

---

## 🚦 Variables de Entorno

Crear `.env` en la raíz del proyecto:

```bash
# Django
DEBUG=True
SECRET_KEY=tu-clave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos (MongoDB)
MONGO_URL=mongodb://localhost:27017/atmos
MONGO_DB_NAME=atmos

# AEMET API
AEMET_API_KEY=tu-clave-aemet

# Email (para reset de contraseña)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-contraseña

# JWT
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME=5
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME=1
```

---

## 📊 Funcionalidades Avanzadas

### Predicciones con Prophet
- Análisis de series temporales históricas
- Predicciones a largo plazo con intervalos de confianza
- Detección de tendencias y estacionalidad
- Manejo automático de missing values

### Caché Inteligente
- Caché por ciudad y tipo de datos
- TTL configurable (1 hora por defecto)
- Invalidación automática de datos antiguos
- Reducción de carga en base de datos

### Integración AEMET
- Datos de la Agencia Estatal de Meteorología
- Actualización automática de observaciones
- Cobertura nacional de España

---

## 📝 Documentación Adicional

- [ALERTS_IMPLEMENTATION.md](./ALERTS_IMPLEMENTATION.md) - Sistema de alertas
- [backend/README.md](./backend/README.md) - Guía del backend
- [frontend/README.md](./frontend/README.md) - Guía del frontend
- [docs/GUIA_CONTRIBUCION.md](./docs/GUIA_CONTRIBUCION.md) - Cómo contribuir
- [docs/00_INDEX.md](./docs/00_INDEX.md) - Índice completo de documentación

---

## 👥 Equipo

Desarrollado por **Super Kode**:
- Anaïs Rodríguez Villanueva
- Yeraldín Salazar

---

## ❓ Soporte

**¿Dudas?** Lee **[docs/00_INDEX.md](./docs/00_INDEX.md)** primero, luego pregunta al equipo.

**¿Problemas técnicos?** Consulta **[docs/FAQ.md](./docs/FAQ.md)**
