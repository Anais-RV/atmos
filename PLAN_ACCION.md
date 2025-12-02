# 🎯 Plan de Acción - Simplificación del Repositorio Atmos

Este documento contiene los pasos concretos para implementar las mejoras propuestas en el [Informe de Simplificación](./INFORME_SIMPLIFICACION.md).

---

## 📝 Resumen

- **Objetivo**: Hacer el repositorio accesible para perfiles junior
- **Enfoque**: Reducir complejidad sin perder funcionalidad
- **Tiempo estimado**: 4-6 horas de trabajo
- **Rama de trabajo**: `refactor/simplify-structure`

---

## 🚀 Fases de Implementación

### **FASE 1: Preparación (30 min)**

#### 1.1 Crear rama de trabajo
```powershell
git checkout dev
git pull origin dev
git checkout -b refactor/simplify-structure
```

#### 1.2 Hacer backup de documentación actual
```powershell
mkdir docs/archivo
Move-Item docs/*.md docs/archivo/
```
*Nota: Mantener backup por si necesitamos recuperar info*

---

### **FASE 2: Nueva Documentación (90 min)**

#### 2.1 Crear `INICIO_RAPIDO.md` (40 min)

**Contenido**:
```markdown
# 🚀 Inicio Rápido - Atmos

## Requisitos
- Python 3.10+
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Git

## Setup en 3 Pasos

### 1. Clonar y Preparar
git clone https://github.com/Anais-RV/atmos.git
cd atmos
.\run.ps1 setup

### 2. Iniciar Backend
.\run.ps1 backend

### 3. Iniciar Frontend (nueva terminal)
.\run.ps1 frontend

¡Listo! Backend: http://127.0.0.1:8000 | Frontend: http://localhost:5173

## Flujo de Trabajo Git (4 pasos)

1. Crear rama: git checkout -b feat/mi-feature
2. Hacer cambios y commits: git add . && git commit -m "feat: mi cambio"
3. Subir: git push -u origin feat/mi-feature
4. Abrir PR en GitHub de feat/mi-feature → dev

## Comandos Útiles

# Backend
.\run.ps1 backend          # Ejecutar servidor
.\run.ps1 migrate          # Aplicar migraciones
.\run.ps1 test-backend     # Ejecutar tests

# Frontend
.\run.ps1 frontend         # Ejecutar servidor
.\run.ps1 test-frontend    # Ejecutar tests
.\run.ps1 build            # Build producción

# General
.\run.ps1 clean            # Limpiar temporales
.\run.ps1 help             # Ver todos los comandos

## Estructura del Proyecto

atmos/
├── backend/          # API Django
│   ├── config/      # Configuración
│   ├── users/       # App usuarios
│   └── weather/     # App meteorología
├── frontend/         # React + Vite
│   └── src/
│       ├── components/  # Componentes reutilizables
│       ├── pages/       # Páginas completas
│       ├── services/    # Llamadas API
│       └── styles/      # Estilos globales
└── docs/             # Documentación (ya estás aquí)

## ¿Problemas?

Consulta [FAQ.md](./FAQ.md) o pregunta al equipo.
```

**Acción**: Crear archivo con este contenido base y expandir si es necesario.

---

#### 2.2 Crear `GUIA_CONTRIBUCION.md` (30 min)

**Contenido**:
```markdown
# 📖 Guía de Contribución - Atmos

## Reglas de Commits

Formato: `tipo: descripción breve`

Tipos:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `style:` Cambios de estilo (CSS, formato)
- `refactor:` Mejora de código sin cambiar funcionalidad
- `docs:` Cambios en documentación
- `test:` Añadir o modificar tests

Ejemplos:
- `feat: añade formulario de login`
- `fix: corrige cálculo de temperatura promedio`
- `style: ajusta espaciado en header`

## Cómo Crear un Pull Request

1. **Asegúrate de estar en tu rama feat/**
   git branch  # Debe mostrar feat/tu-feature

2. **Sube tus cambios**
   git push -u origin feat/tu-feature

3. **Abre PR en GitHub**
   - Ve a https://github.com/Anais-RV/atmos/pulls
   - Click en "New Pull Request"
   - Base: `dev` ← Compare: `feat/tu-feature`
   - Rellena la plantilla

4. **Espera revisión y aprobación**

5. **Haz merge cuando esté aprobado**

## Dónde Poner Cada Cosa

### Backend
- **Modelos**: `backend/app_name/models.py`
- **Vistas**: `backend/app_name/views.py`
- **URLs**: `backend/app_name/urls.py`
- **Tests**: `backend/app_name/tests.py`

### Frontend
- **Componentes reutilizables**: `frontend/src/components/`
- **Páginas completas**: `frontend/src/pages/`
- **Llamadas a API**: `frontend/src/services/`
- **Estilos globales**: `frontend/src/styles/`

## Convenciones de Código

### Python (Backend)
1. Usa nombres descriptivos: `get_user_data()` no `gud()`
2. Funciones pequeñas (máximo 20 líneas)
3. Docstrings en funciones públicas
4. Sigue PEP 8 (el linter te avisará)

### JavaScript (Frontend)
1. Componentes en PascalCase: `UserCard.jsx`
2. Funciones en camelCase: `getUserData()`
3. Constantes en UPPER_CASE: `API_URL`
4. Un componente por archivo

### CSS
1. Usa nombres descriptivos: `.user-card` no `.uc`
2. Evita !important
3. Prefiere flexbox/grid sobre posiciones absolutas

## Qué NO Hacer

❌ NO hacer push directo a `main` o `dev`
❌ NO subir archivos `.env` con credenciales
❌ NO subir `node_modules/` o `venv/`
❌ NO hacer commits gigantes (mejor varios pequeños)
❌ NO ignorar errores del linter

## Antes de Hacer Push

- [ ] El código funciona en local
- [ ] No hay console.logs olvidados
- [ ] Los tests pasan
- [ ] El linter no marca errores
- [ ] Añadiste/actualizaste tests si hace falta

## ¿Dudas?

Pregunta al equipo antes de inventar. Es mejor preguntar que romper `dev`.
```

**Acción**: Crear archivo con este contenido.

---

#### 2.3 Crear `FAQ.md` (20 min)

**Contenido**:
```markdown
# ❓ Preguntas Frecuentes - Atmos

## Setup y Configuración

### ¿Qué hago si `.\run.ps1 setup` falla?

1. **Error "python no reconocido"**
   - Instala Python 3.10+ desde python.org
   - Marca "Add Python to PATH" durante instalación

2. **Error "pnpm no reconocido"**
   - Ejecuta: `npm install -g pnpm`

3. **Error al crear venv**
   - Windows: `python -m pip install --upgrade pip`
   - Ejecuta: `python -m venv backend/venv` manualmente

### El backend no arranca

- Verifica que el venv esté activo: `.\backend\venv\Scripts\Activate.ps1`
- Asegúrate de haber ejecutado: `.\run.ps1 migrate`
- Revisa que el puerto 8000 no esté ocupado

### El frontend no arranca

- Elimina `node_modules`: `rm -r frontend/node_modules`
- Reinstala: `cd frontend && pnpm install`
- Revisa que el puerto 5173 no esté ocupado

## Git y Colaboración

### No puedo hacer push

- Asegúrate de estar en una rama `feat/`: `git branch`
- Si estás en `dev` o `main`, crea una rama: `git checkout -b feat/mi-feature`

### Tengo conflictos al hacer merge

1. Abre los archivos con conflictos
2. Busca las marcas `<<<<<<<`, `=======`, `>>>>>>>`
3. Decide qué código mantener
4. Elimina las marcas
5. `git add .` y `git commit -m "merge: resuelve conflictos"`

### ¿Cómo actualizo mi rama con cambios de dev?

git checkout dev
git pull origin dev
git checkout feat/mi-feature
git merge dev

## Desarrollo

### ¿Dónde pongo un nuevo componente?

- **Reutilizable** (botón, card, input): `frontend/src/components/`
- **Página completa** (dashboard, login): `frontend/src/pages/`

### ¿Cómo llamo a la API desde el frontend?

Usa el cliente en `services/apiClient.js`:

import apiClient from '../services/apiClient';

const data = await apiClient.get('/api/weather/');

### ¿Cómo creo una nueva app en Django?

cd backend
python manage.py startapp nombre_app

Luego añade `'nombre_app'` a `INSTALLED_APPS` en `config/settings.py`

### El linter marca errores

- **Backend**: El linter sigue PEP 8. Corrige los errores que marca.
- **Frontend**: ESLint verifica buenas prácticas. Corrige o ajusta `.eslintrc` si es necesario.

## Tests

### ¿Cómo ejecuto los tests?

- Backend: `.\run.ps1 test-backend`
- Frontend: `.\run.ps1 test-frontend`

### No sé cómo escribir tests

- Backend: Mira ejemplos en `backend/*/tests/`
- Frontend: Consulta documentación de Vitest/Testing Library
- Pregunta al equipo para ejemplos específicos

## CI/CD

### ¿Qué es CI/CD?

**CI/CD** = Continuous Integration / Continuous Deployment

En este proyecto: GitHub Actions ejecuta automáticamente tests cuando abres un PR.

### Mi PR falla en CI/CD

1. Mira los logs en GitHub (tab "Actions")
2. Identifica qué test/lint falla
3. Corrige en local
4. Haz push de nuevo (CI volverá a ejecutarse)

### ¿Puedo hacer merge si CI falla?

Técnicamente sí, pero **NO lo hagas**. Corrige los errores primero.

## Otros

### ¿Por qué pnpm y no npm?

pnpm es más rápido y usa menos espacio en disco. Sintaxis idéntica a npm.

### ¿Puedo usar Django admin?

Sí. Crea un superusuario: `.\run.ps1 superuser`
Accede en: http://127.0.0.1:8000/admin

### ¿Dónde está la base de datos?

En desarrollo: `backend/db.sqlite3`
No la subas a Git (ya está en .gitignore)

### ¿Qué es el archivo .env?

Variables de entorno (API keys, secrets). 
- `.env.example`: Plantilla (SÍ sube a Git)
- `.env`: Tu configuración real (NO subas a Git)

## 📚 Recursos Externos

- [Django Docs](https://docs.djangoproject.com/)
- [React Docs](https://react.dev/)
- [Git Basics](https://git-scm.com/book/en/v2)
- [Vite Docs](https://vitejs.dev/)

## 🆘 Aún Tengo Problemas

1. Busca en este FAQ
2. Busca en documentación archivada: `docs/archivo/`
3. Pregunta en el chat del equipo
4. Crea un issue en GitHub describiendo el problema
```

**Acción**: Crear archivo con este contenido.

---

### **FASE 3: Simplificar Scripts (60 min)**

#### 3.1 Crear `run.ps1` mejorado (45 min)

**Acción**: Crear nuevo script unificado y simplificado.

```powershell
# run.ps1 - Script unificado para Atmos
# Uso: .\run.ps1 [comando]

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host ""
    Write-Host "🌤️  Atmos - Comandos Disponibles" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Setup:" -ForegroundColor Yellow
    Write-Host "  .\run.ps1 setup             - Configurar todo (backend + frontend)"
    Write-Host ""
    Write-Host "Desarrollo:" -ForegroundColor Green
    Write-Host "  .\run.ps1 backend           - Ejecutar servidor backend"
    Write-Host "  .\run.ps1 frontend          - Ejecutar servidor frontend"
    Write-Host ""
    Write-Host "Base de Datos:" -ForegroundColor Blue
    Write-Host "  .\run.ps1 migrate           - Aplicar migraciones"
    Write-Host "  .\run.ps1 migrations        - Crear migraciones"
    Write-Host "  .\run.ps1 superuser         - Crear superusuario admin"
    Write-Host ""
    Write-Host "Tests:" -ForegroundColor Magenta
    Write-Host "  .\run.ps1 test-backend      - Ejecutar tests backend"
    Write-Host "  .\run.ps1 test-frontend     - Ejecutar tests frontend"
    Write-Host ""
    Write-Host "Build:" -ForegroundColor DarkYellow
    Write-Host "  .\run.ps1 build             - Build producción frontend"
    Write-Host ""
    Write-Host "Utilidades:" -ForegroundColor Gray
    Write-Host "  .\run.ps1 clean             - Limpiar archivos temporales"
    Write-Host "  .\run.ps1 help              - Mostrar esta ayuda"
    Write-Host ""
}

function Setup-All {
    Write-Host "⚙️  Configurando Atmos..." -ForegroundColor Cyan
    Write-Host ""
    
    # Backend
    Write-Host "📦 Configurando backend..." -ForegroundColor Yellow
    if (!(Test-Path "backend/venv")) {
        python -m venv backend/venv
        Write-Host "✅ Entorno virtual creado" -ForegroundColor Green
    } else {
        Write-Host "✅ Entorno virtual ya existe" -ForegroundColor Green
    }
    
    Write-Host "📥 Instalando dependencias backend..." -ForegroundColor Yellow
    & backend/venv/Scripts/Activate.ps1
    pip install -r backend/requirements.txt
    
    Write-Host "🗄️  Aplicando migraciones..." -ForegroundColor Yellow
    python backend/manage.py migrate
    
    Write-Host ""
    Write-Host "✅ Backend configurado" -ForegroundColor Green
    Write-Host ""
    
    # Frontend
    Write-Host "📦 Configurando frontend..." -ForegroundColor Yellow
    Set-Location frontend
    pnpm install
    Set-Location ..
    
    Write-Host ""
    Write-Host "✅ Frontend configurado" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 ¡Todo listo! Usa:" -ForegroundColor Cyan
    Write-Host "   .\run.ps1 backend   → Iniciar backend" -ForegroundColor White
    Write-Host "   .\run.ps1 frontend  → Iniciar frontend" -ForegroundColor White
    Write-Host ""
}

function Start-Backend {
    Write-Host "🚀 Iniciando backend Django..." -ForegroundColor Yellow
    
    if (!(Test-Path "backend/venv")) {
        Write-Host "❌ Entorno virtual no encontrado" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    & backend/venv/Scripts/Activate.ps1
    python backend/manage.py runserver
}

function Start-Frontend {
    Write-Host "🚀 Iniciando frontend Vite..." -ForegroundColor Green
    
    if (!(Test-Path "frontend/node_modules")) {
        Write-Host "❌ Dependencias no encontradas" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    Set-Location frontend
    pnpm dev
    Set-Location ..
}

function Run-Migrate {
    Write-Host "🗄️  Aplicando migraciones..." -ForegroundColor Blue
    & backend/venv/Scripts/Activate.ps1
    python backend/manage.py migrate
}

function Create-Migrations {
    Write-Host "📝 Creando migraciones..." -ForegroundColor Blue
    & backend/venv/Scripts/Activate.ps1
    python backend/manage.py makemigrations
}

function Create-Superuser {
    Write-Host "👤 Creando superusuario..." -ForegroundColor Blue
    & backend/venv/Scripts/Activate.ps1
    python backend/manage.py createsuperuser
}

function Test-Backend {
    Write-Host "🧪 Ejecutando tests backend..." -ForegroundColor Magenta
    & backend/venv/Scripts/Activate.ps1
    pytest backend/
}

function Test-Frontend {
    Write-Host "🧪 Ejecutando tests frontend..." -ForegroundColor Magenta
    Set-Location frontend
    pnpm test
    Set-Location ..
}

function Build-Frontend {
    Write-Host "🏗️  Construyendo frontend para producción..." -ForegroundColor DarkYellow
    Set-Location frontend
    pnpm build
    Set-Location ..
    Write-Host "✅ Build completado en: frontend/dist/" -ForegroundColor Green
}

function Clean-All {
    Write-Host "🧹 Limpiando archivos temporales..." -ForegroundColor Gray
    
    # Python
    Get-ChildItem -Path backend -Recurse -Filter "__pycache__" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
    Get-ChildItem -Path backend -Recurse -Filter "*.pyc" -ErrorAction SilentlyContinue | Remove-Item -Force
    
    # Node
    if (Test-Path "frontend/node_modules") {
        Remove-Item "frontend/node_modules" -Recurse -Force
    }
    if (Test-Path "frontend/dist") {
        Remove-Item "frontend/dist" -Recurse -Force
    }
    if (Test-Path "frontend/.vite") {
        Remove-Item "frontend/.vite" -Recurse -Force
    }
    
    Write-Host "✅ Limpieza completada" -ForegroundColor Green
}

# Router de comandos
switch ($Command.ToLower()) {
    "setup"         { Setup-All }
    "backend"       { Start-Backend }
    "frontend"      { Start-Frontend }
    "migrate"       { Run-Migrate }
    "migrations"    { Create-Migrations }
    "superuser"     { Create-Superuser }
    "test-backend"  { Test-Backend }
    "test-frontend" { Test-Frontend }
    "build"         { Build-Frontend }
    "clean"         { Clean-All }
    "help"          { Show-Help }
    default {
        Write-Host "❌ Comando desconocido: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
```

**Acción**: Guardar como `run.ps1`

#### 3.2 Eliminar archivos antiguos

```powershell
Remove-Item Makefile
Remove-Item scripts.ps1
```

---

### **FASE 4: Simplificar README (20 min)**

#### 4.1 Reescribir `README.md`

```markdown
# 🌤️ Atmos - Sistema Meteorológico

Sistema fullstack para gestión y visualización de datos meteorológicos.

## 🚀 Inicio Rápido

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Anais-RV/atmos.git
   cd atmos
   ```

2. Configura todo:
   ```powershell
   .\run.ps1 setup
   ```

3. Inicia los servidores:
   ```powershell
   # Terminal 1 - Backend
   .\run.ps1 backend

   # Terminal 2 - Frontend
   .\run.ps1 frontend
   ```

4. Abre tu navegador:
   - Backend: http://127.0.0.1:8000
   - Frontend: http://localhost:5173

## 📚 Documentación

- **[Inicio Rápido](./INICIO_RAPIDO.md)** - Setup detallado y comandos
- **[Guía Contribución](./GUIA_CONTRIBUCION.md)** - Cómo colaborar
- **[FAQ](./FAQ.md)** - Problemas comunes

## 🛠️ Stack Tecnológico

- **Backend**: Django 5.1 + Django REST Framework
- **Frontend**: React 19 + Vite 7
- **Base de Datos**: SQLite (desarrollo)
- **Gestor de Paquetes**: pnpm

## 🌿 Flujo Git

```bash
git checkout -b feat/mi-feature  # 1. Crear rama
git commit -m "feat: mi cambio"  # 2. Hacer cambios
git push -u origin feat/mi-feature  # 3. Subir
# 4. Abrir PR en GitHub
```

Consulta [GUIA_CONTRIBUCION.md](./GUIA_CONTRIBUCION.md) para más detalles.

## 👥 Equipo

Desarrollado por **Super Kode**:
- Anaïs Rodríguez Villanueva
- Yeraldín Salazar

## 📝 Licencia

Proyecto educativo desarrollado como parte del programa Super Kode.

---

**¿Dudas?** → [FAQ.md](./FAQ.md) | **¿Problemas?** → Abre un issue
```

**Acción**: Reemplazar contenido completo de `README.md`

---

### **FASE 5: CI/CD Básico (45 min)**

#### 5.1 Crear estructura GitHub Actions

```powershell
mkdir .github/workflows -Force
```

#### 5.2 Crear `.github/workflows/check.yml`

```yaml
name: Verificaciones Básicas

on:
  pull_request:
    branches: [dev, main]

jobs:
  backend-tests:
    name: Tests Backend
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout código
        uses: actions/checkout@v4
      
      - name: Configurar Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      
      - name: Instalar dependencias
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Ejecutar tests
        run: |
          cd backend
          pytest

  frontend-checks:
    name: Lint y Build Frontend
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout código
        uses: actions/checkout@v4
      
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Instalar pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Instalar dependencias
        run: |
          cd frontend
          pnpm install
      
      - name: Ejecutar lint
        run: |
          cd frontend
          pnpm lint
      
      - name: Build producción
        run: |
          cd frontend
          pnpm build
```

**Acción**: Crear archivo con este contenido.

---

### **FASE 6: Reorganizar Estructura (30 min)**

#### 6.1 Consolidar carpetas frontend

```powershell
# Mover auth a components
Move-Item frontend/src/auth frontend/src/components/auth

# Mover chart a components
Move-Item frontend/src/chart frontend/src/components/charts

# Mover history a components
Move-Item frontend/src/history frontend/src/components/history
```

#### 6.2 Actualizar imports en archivos afectados

**Acción**: Buscar y reemplazar imports en archivos .jsx:
- `from '../auth/` → `from '../components/auth/`
- `from '../chart/` → `from '../components/charts/`
- `from '../history/` → `from '../components/history/`

---

### **FASE 7: Archivado de Docs (15 min)**

#### 7.1 Mantener backup

```powershell
# Ya hicimos backup en FASE 1, confirmar que existe
ls docs/archivo/
```

#### 7.2 Eliminar docs raíz redundantes

```powershell
Remove-Item docs/makefile-guide.md
Remove-Item docs/django-guide.md
```

*Nota: Otros archivos se pueden conservar en archivo/ como referencia.*

---

### **FASE 8: Testing y Validación (45 min)**

#### 8.1 Probar setup completo

```powershell
# Limpiar todo
.\run.ps1 clean

# Eliminar venv para simular setup fresco
Remove-Item backend/venv -Recurse -Force

# Probar setup
.\run.ps1 setup

# Verificar que funciona
.\run.ps1 backend  # (en otra terminal)
.\run.ps1 frontend # (en otra terminal)
```

#### 8.2 Probar comandos uno por uno

```powershell
.\run.ps1 help
.\run.ps1 migrate
.\run.ps1 test-backend
.\run.ps1 test-frontend
.\run.ps1 build
```

#### 8.3 Verificar CI/CD

- Hacer commit de cambios
- Push a la rama
- Abrir PR de prueba
- Verificar que Actions se ejecuta correctamente

---

### **FASE 9: Actualizar PROJECT_STATUS.md (15 min)**

#### 9.1 Documentar cambios

Añadir sección en `PROJECT_STATUS.md`:

```markdown
## 🔄 Refactorización de Simplificación (02/12/2025)

### Cambios Implementados

✅ **Documentación consolidada**: 7 → 3 archivos
✅ **Script unificado**: run.ps1 reemplaza Makefile + scripts.ps1
✅ **README simplificado**: 180 → 50 líneas
✅ **CI/CD básico**: GitHub Actions para verificaciones automáticas
✅ **Estructura frontend**: Carpetas auth/chart/history → components/
✅ **Tiempo de setup**: 30min → 5min

### Archivos Nuevos
- `INICIO_RAPIDO.md`
- `GUIA_CONTRIBUCION.md`
- `FAQ.md`
- `run.ps1`
- `.github/workflows/check.yml`

### Archivos Eliminados
- `Makefile`
- `scripts.ps1`
- `docs/makefile-guide.md`
- `docs/django-guide.md`

### Resultado
- 🎯 **Más accesible para juniors**
- ⚡ **Setup en 3 comandos**
- 📖 **Documentación directa**
- 🔄 **CI/CD automático**
```

---

### **FASE 10: Merge y Documentación Final (30 min)**

#### 10.1 Commit final

```powershell
git add .
git commit -m "refactor: simplifica estructura para perfiles junior

- Consolida documentación (7→3 archivos)
- Unifica scripts en run.ps1
- Añade CI/CD básico
- Reorganiza estructura frontend
- Simplifica README
- Mejora accesibilidad para juniors"
```

#### 10.2 Push y PR

```powershell
git push -u origin refactor/simplify-structure
```

Abrir PR con descripción detallada usando plantilla.

#### 10.3 Revisar y mergear

1. Pedir revisión al equipo
2. Verificar que CI pasa
3. Hacer merge a `dev`
4. Eliminar rama `refactor/simplify-structure`

---

## ✅ Checklist de Verificación Final

Antes de dar por completada la simplificación, verificar:

- [ ] `.\run.ps1 setup` funciona sin errores
- [ ] Backend arranca correctamente
- [ ] Frontend arranca correctamente
- [ ] Tests backend pasan
- [ ] Tests frontend pasan (si existen)
- [ ] Build frontend funciona
- [ ] CI/CD se ejecuta en PRs
- [ ] Documentación está actualizada
- [ ] Imports frontend corregidos tras mover carpetas
- [ ] PROJECT_STATUS.md actualizado
- [ ] README es claro y conciso
- [ ] No hay archivos obsoletos en raíz

---

## 📊 Métricas de Éxito

Después de implementar:

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Archivos docs | 7 | 3 | -57% |
| Líneas README | 180 | 50 | -72% |
| Scripts | 2 | 1 | -50% |
| Comandos setup | 6+ | 1 | -83% |
| Tiempo setup | ~30min | ~5min | -83% |
| Carpetas src/ | 7 | 4 | -43% |

---

## 🎓 Formación del Equipo

Después del merge, presentar al equipo:

1. **Demo del nuevo flujo** (10 min)
   - Mostrar `.\run.ps1 setup`
   - Mostrar comandos principales
   - Explicar nueva estructura de docs

2. **Recorrido por documentación** (15 min)
   - INICIO_RAPIDO.md
   - GUIA_CONTRIBUCION.md
   - FAQ.md

3. **Práctica** (30 min)
   - Cada miembro hace setup desde cero
   - Crea rama feat/test-simplificacion
   - Hace un cambio pequeño
   - Abre PR de prueba
   - Ve cómo funciona CI/CD

---

## 📝 Notas

- **Backup**: Los docs originales están en `docs/archivo/` por si se necesitan
- **Rollback**: Si algo falla, la rama original está en Git
- **Feedback**: Después de 1 semana, pedir feedback al equipo sobre la nueva estructura
- **Iteración**: Ajustar según feedback (FAQ puede crecer con preguntas reales)

---

## 🚀 Siguiente Nivel (Opcional - Futuro)

Una vez el equipo esté cómodo:

1. **Pre-commit hooks**: Linting automático antes de commits
2. **Plantilla de issues**: Para reportar bugs/features
3. **Bot de bienvenida**: Para nuevos contributors
4. **Deploy automático**: CD real a staging/producción
5. **Monitoreo**: Logs y métricas automáticas

*Pero por ahora: simplicidad primero* 🎯

---

**Tiempo total estimado**: 4-6 horas
**Impacto**: Alto - Mejora significativa en accesibilidad

¡Manos a la obra! 🔥☕
