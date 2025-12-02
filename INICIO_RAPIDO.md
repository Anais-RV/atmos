# 🚀 Inicio Rápido - Atmos

## Requisitos

- Python 3.10+
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Git

---

## Setup en 3 Pasos

### 1. Clonar y preparar

```powershell
git clone https://github.com/Anais-RV/atmos.git
cd atmos
```

### 2. Configurar backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Backend listo en**: http://127.0.0.1:8000

### 3. Configurar frontend (nueva terminal)

```powershell
cd frontend
pnpm install
pnpm dev
```

**Frontend listo en**: http://localhost:5173

---

## Comandos Básicos

### Backend

```powershell
# Iniciar servidor
python manage.py runserver

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (admin)
python manage.py createsuperuser

# Ejecutar tests
pytest
```

### Frontend

```powershell
# Iniciar servidor desarrollo
pnpm dev

# Build producción
pnpm build

# Preview build
pnpm preview
```

---

## Flujo Git (4 pasos)

```bash
# 1. Crear rama desde dev
git checkout dev
git pull origin dev
git checkout -b feat/mi-funcionalidad

# 2. Hacer cambios y commits
git add .
git commit -m "feat: descripción del cambio"

# 3. Subir rama
git push -u origin feat/mi-funcionalidad

# 4. Abrir PR en GitHub
# De: feat/mi-funcionalidad → A: dev
```

**Importante**: 
- ❌ Nunca hacer push directo a `main` o `dev`
- ✅ Siempre trabajar en ramas `feat/nombre-corto`

---

## Estructura del Proyecto

```
atmos/
├── backend/                # API Django
│   ├── config/            # Configuración Django
│   ├── users/             # App gestión usuarios
│   ├── weather/           # App datos meteorológicos
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/              # App React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas completas
│   │   ├── services/     # Llamadas API
│   │   └── styles/       # Estilos CSS
│   ├── package.json
│   └── vite.config.js
│
└── docs/                  # Documentación
```

---

## Dónde Va Cada Cosa

### Backend
- **Modelos** → `backend/nombre_app/models.py`
- **Vistas** → `backend/nombre_app/views.py`
- **URLs** → `backend/nombre_app/urls.py`
- **Tests** → `backend/nombre_app/tests.py`

### Frontend
- **Componentes** → `frontend/src/components/`
- **Páginas** → `frontend/src/pages/`
- **API** → `frontend/src/services/apiClient.js`
- **Estilos** → `frontend/src/styles/`

---

## Problemas Comunes

### Backend no arranca
```powershell
# Activa el entorno virtual
.\backend\venv\Scripts\Activate.ps1

# Verifica dependencias
pip install -r backend/requirements.txt

# Aplica migraciones
python backend/manage.py migrate
```

### Frontend no arranca
```powershell
# Reinstala dependencias
cd frontend
rm -r node_modules
pnpm install
```

### No puedo hacer push
```bash
# Verifica que estás en una rama feat/
git branch

# Si estás en dev o main, crea una rama
git checkout -b feat/mi-funcionalidad
```

---

## Siguiente Paso

- **¿Dudas de desarrollo?** → [GUIA_CONTRIBUCION.md](./GUIA_CONTRIBUCION.md)
- **¿Problemas técnicos?** → [FAQ.md](./FAQ.md)

¡Listo para programar! 🎉
