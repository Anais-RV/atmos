# 🚀 Inicio Rápido - Atmos

## Requisitos

- Python 3.10+
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Git

---

## Setup Rápido (Recomendado para Principiantes) 🎯

**Los scripts se encargan de todo automáticamente:**

### Opción 1: Menú Interactivo (Windows - LA MÁS FÁCIL) 🌟

```powershell
# 1. Clona el proyecto
git clone https://github.com/Anais-RV/atmos.git
cd atmos

# 2. Abre el menú interactivo
.\menu.ps1
```

**Usa las flechas ↑↓ para navegar y Enter para seleccionar**
- Primero: "🏗️ Setup Completo del Proyecto"
- Después: "▶️ Iniciar Backend" y "▶️ Iniciar Frontend"

✅ **Ventajas**:
- No necesitas memorizar comandos
- Registra todo en `logs/` por si algo falla
- Te dice exactamente qué está haciendo
- Perfecto para principiantes

### Opción 2: Comandos Directos (Windows PowerShell)

```powershell
# 1. Clona el proyecto
git clone https://github.com/Anais-RV/atmos.git
cd atmos

# 2. Configura todo automáticamente
.\run.ps1 setup

# 3. Inicia backend (en una terminal)
.\run.ps1 backend

# 4. Inicia frontend (en OTRA terminal)
.\run.ps1 frontend
```

### Opción 3: Makefile (Linux/Mac/Windows con make)

```bash
# 1. Clona el proyecto
git clone https://github.com/Anais-RV/atmos.git
cd atmos

# 2. Configura todo automáticamente
make setup

# 3. Inicia backend (en una terminal)
make backend

# 4. Inicia frontend (en OTRA terminal)
make frontend
```

✅ **Ventaja de los scripts**: No tienes que cambiar de carpeta manualmente, ellos lo hacen por ti

---

## Setup Manual (Avanzado)

<details>
<summary>⚠️ Haz clic aquí solo si NO quieres usar los scripts automatizados</summary>

### 1. Configurar backend manualmente

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Backend listo en**: http://127.0.0.1:8000

### 2. Configurar frontend manualmente (nueva terminal)

⚠️ **IMPORTANTE**: Debes estar dentro de `frontend/`

```powershell
# Desde la raíz del proyecto:
cd frontend

# Instala y ejecuta:
pnpm install
pnpm dev
```

**Frontend listo en**: http://localhost:5173

❌ **Error común**: Si ves `ENOENT: no such file package.json`, NO estás en la carpeta `frontend/`

</details>

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

⚠️ **Ejecuta estos comandos DENTRO de la carpeta `frontend/`**

```powershell
# Asegúrate de estar en frontend/
cd frontend

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

## 🚨 Problemas Comunes

### ❌ Error: "ENOENT: no such file package.json"

**Causa**: Ejecutaste `pnpm dev` desde la raíz del proyecto

**Solución**:
```bash
# Opción 1: Usa comandos automatizados (recomendado)
make frontend          # Linux/Mac
.\run.ps1 frontend     # Windows

# Opción 2: Muévete a frontend/
cd frontend
pnpm dev
```

### ❌ Backend no arranca

**Solución**:
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
- **Volver al índice** → [00_INDEX.md](./00_INDEX.md)

¡Listo para programar! 🎉
