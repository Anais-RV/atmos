# Backend Django - Atmos

Backend construido con **Django** y **Django REST Framework** para el proyecto Atmos.

---

## 📋 Requisitos

- Python 3.10 o superior
- pip (gestor de paquetes de Python)

---

## 🚀 Configuración Inicial

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

#### Linux/Mac:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

Con el entorno virtual activado:

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y edita según necesites:

```bash
cp .env.example .env
```

### 5. Crear el proyecto Django

**IMPORTANTE**: El equipo debe ejecutar esto para inicializar Django:

```bash
django-admin startproject config .
```

Este comando crea la estructura base de Django en la carpeta actual.

**⚠️ Si ya existe una carpeta `config/` de intentos anteriores:**
```bash
# Windows
Remove-Item -Recurse -Force config

# Linux/Mac
rm -rf config

# Luego vuelve a ejecutar
django-admin startproject config .
```

### 6. Aplicar migraciones

```bash
python manage.py migrate
```

### 7. Crear superusuario (opcional)

```bash
python manage.py createsuperuser
```

---

## ▶️ Ejecutar el servidor

```bash
python manage.py runserver
```

El servidor estará disponible en: **http://127.0.0.1:8000**

---

## 🏗️ Estructura Recomendada

Una vez creado el proyecto, la estructura será:

```
backend/
├── venv/                    # Entorno virtual
├── config/                  # Configuración del proyecto Django
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/                    # Carpeta para las apps (crear manualmente)
│   └── (tus apps aquí)
├── manage.py
├── requirements.txt
├── .env
└── README.md
```

---

## 📱 Crear Apps

Para cada funcionalidad, crea una app Django:

```bash
python manage.py startapp nombre_app
```

**Recomendación**: Crea las apps dentro de una carpeta `apps/`:

```bash
mkdir apps
python manage.py startapp weather apps/weather
python manage.py startapp users apps/users
```

No olvides registrar las apps en `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'apps.weather',
    'apps.users',
]
```

---

## 🔧 Comandos Útiles

```bash
# Crear migraciones después de cambiar modelos
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario para admin
python manage.py createsuperuser

# Abrir shell de Django
python manage.py shell

# Ejecutar tests
python manage.py test

# Crear app nueva
python manage.py startapp nombre_app
```

---

## 📚 Próximos Pasos

Consulta la documentación en `docs/` para:
- Conceptos fundamentales de Django
- Mejores prácticas
- Guía de desarrollo paso a paso

---

## 🆘 Solución de Problemas

### Error: "No module named 'django'"
- Verifica que el entorno virtual esté activado
- Ejecuta `pip install -r requirements.txt`

### Error al ejecutar manage.py
- Asegúrate de haber ejecutado `django-admin startproject config .`

### Puerto ocupado
- Usa otro puerto: `python manage.py runserver 8001`

---

**Consulta `docs/django-guide.md` para una guía completa con conceptos y ejemplos.**
