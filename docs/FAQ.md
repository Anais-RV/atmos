# ❓ FAQ - Preguntas Frecuentes

## Setup y Configuración

### ❌ Error: "python no se reconoce como comando"

**Solución**:
1. Instala Python desde https://python.org
2. ✅ Marca "Add Python to PATH" durante instalación
3. Reinicia la terminal

### ❌ Error: "pnpm no se reconoce como comando"

**Solución**:
```bash
npm install -g pnpm
```

### ❌ Error al crear entorno virtual

**Solución**:
```powershell
# Actualiza pip
python -m pip install --upgrade pip

# Crea el venv manualmente
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### ❌ El backend no arranca

**Checklist**:
1. ¿Activaste el entorno virtual?
   ```powershell
   .\backend\venv\Scripts\Activate.ps1
   ```

2. ¿Instalaste dependencias?
   ```powershell
   pip install -r backend/requirements.txt
   ```

3. ¿Aplicaste migraciones?
   ```powershell
   python backend/manage.py migrate
   ```

4. ¿El puerto 8000 está libre?
   - Cierra otros procesos que lo usen
   - O usa otro puerto: `python manage.py runserver 8001`

### ❌ Error: "ENOENT: no such file package.json"

**Causa**: Estás ejecutando `pnpm` desde la raíz del proyecto en lugar de `frontend/`

**Solución**:
```bash
# Opción 1: Usa comandos automatizados (MÁS FÁCIL)
make frontend          # Linux/Mac
.\run.ps1 frontend     # Windows PowerShell

# Opción 2: Manual - Verifica dónde estás
pwd

# Si estás en .../atmos, muévete a frontend:
cd frontend

# Ahora ejecuta:
pnpm dev
```

### ❌ El frontend no arranca (otros errores)

**Solución**:
```powershell
# Asegúrate de estar en frontend/
cd frontend

# Elimina node_modules
rm -r node_modules

# Reinstala
pnpm install

# Intenta de nuevo
pnpm dev
```

Si sigue fallando:
```powershell
# Limpia caché de pnpm
pnpm store prune
pnpm install
```

---

## Git y Colaboración

### ❌ No puedo hacer push

**Causa**: Estás en `dev` o `main`

**Solución**:
```bash
# Verifica en qué rama estás
git branch

# Si estás en dev/main, crea una rama
git checkout -b feat/mi-funcionalidad

# Luego haz push
git push -u origin feat/mi-funcionalidad
```

### ❌ Tengo conflictos al hacer merge

**Solución paso a paso**:

1. Git te dirá qué archivos tienen conflictos
2. Abre esos archivos en tu editor
3. Busca las marcas:
   ```
   <<<<<<< HEAD
   tu código
   =======
   código de dev
   >>>>>>> dev
   ```
4. Decide qué código mantener
5. Elimina las marcas `<<<<`, `====`, `>>>>`
6. Guarda el archivo
7. Termina el merge:
   ```bash
   git add .
   git commit -m "merge: resuelve conflictos con dev"
   git push
   ```

### ❌ Necesito actualizar mi rama con dev

**Solución**:
```bash
# 1. Guarda tus cambios
git add .
git commit -m "wip: guardando progreso"

# 2. Actualiza dev
git checkout dev
git pull origin dev

# 3. Vuelve a tu rama
git checkout feat/mi-funcionalidad

# 4. Trae cambios de dev
git merge dev

# 5. Si hay conflictos, resuélvelos (ver arriba)
```

### ❌ "Your branch is behind 'origin/dev'"

**Solución**:
```bash
git pull origin dev
```

### ❌ Hice commit en dev por error

**Solución**:
```bash
# 1. Crea una rama con esos cambios
git checkout -b feat/cambios-rescatados

# 2. Vuelve a dev y resetea
git checkout dev
git reset --hard origin/dev

# 3. Sigue trabajando en tu nueva rama
git checkout feat/cambios-rescatados
```

---

## Desarrollo

### ❌ No sé dónde poner mi componente

**Regla simple**:

- ¿Lo usarás en varias páginas? → `components/`
- ¿Es una página completa? → `pages/`

**Ejemplos**:
- `Button.jsx` → `components/common/`
- `LoginForm.jsx` → `components/auth/`
- `LoginPage.jsx` → `pages/`

### ❌ ¿Cómo llamo a la API desde frontend?

**Solución**:

```jsx
import apiClient from '../services/apiClient';

// GET
const data = await apiClient.get('/api/weather/');

// POST
const result = await apiClient.post('/api/weather/', {
  temperature: 25.5,
  humidity: 60
});
```

### ❌ ¿Cómo creo una nueva app en Django?

**Solución**:
```bash
cd backend
python manage.py startapp nombre_app
```

Luego añade en `config/settings.py`:
```python
INSTALLED_APPS = [
    ...
    'nombre_app',
]
```

### ❌ Error de CORS en frontend

**Causa**: El backend no permite tu puerto

**Solución**: En `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",  # Añade tu puerto
]
```

### ❌ "Module not found" en frontend

**Solución**:
```bash
# Instala la dependencia
pnpm add nombre-paquete

# Si es de desarrollo
pnpm add -D nombre-paquete
```

---

## Tests

### ❌ ¿Cómo ejecuto los tests?

**Backend**:
```bash
cd backend
pytest
```

**Frontend**:
```bash
cd frontend
pnpm test
```

### ❌ Los tests fallan

**Checklist**:
1. ¿Instalaste dependencias de test?
2. ¿El código funciona manualmente?
3. ¿Los imports son correctos?

**Backend**:
```bash
pip install pytest pytest-django
```

---

## Base de Datos

### ❌ "No such table"

**Causa**: No aplicaste migraciones

**Solución**:
```bash
python manage.py migrate
```

### ❌ "You have unapplied migrations"

**Solución**:
```bash
python manage.py makemigrations
python manage.py migrate
```

### ❌ Quiero resetear la base de datos

**⚠️ Cuidado: Perderás todos los datos**

```bash
# Elimina la BD
rm backend/db.sqlite3

# Vuelve a crear
python backend/manage.py migrate

# Crea superusuario de nuevo
python backend/manage.py createsuperuser
```

---

## CI/CD (GitHub Actions)

### ❌ Mi PR falla en CI

**Solución**:
1. Haz click en "Details" del check que falló
2. Lee el error en los logs
3. Corrígelo en local
4. Haz push (CI se ejecutará de nuevo)

**Errores comunes**:
- Falta instalar dependencia
- Test que falla
- Error de lint/formato

### ❌ ¿Puedo hacer merge si CI falla?

**NO**. Corrige los errores primero.

Los checks están ahí para evitar romper `dev`.

---

## Otros

### ❌ ¿Por qué pnpm y no npm?

**pnpm** es:
- ⚡ Más rápido
- 💾 Usa menos espacio en disco
- 🔒 Más seguro (node_modules estricto)

Sintaxis es idéntica a npm:
```bash
npm install   →   pnpm install
npm add axios →   pnpm add axios
```

### ❌ ¿Cómo accedo al admin de Django?

1. Crea un superusuario:
   ```bash
   python manage.py createsuperuser
   ```

2. Ve a: http://127.0.0.1:8000/admin

3. Inicia sesión con tus credenciales

### ❌ ¿Dónde está la base de datos?

En desarrollo: `backend/db.sqlite3`

**⚠️ NO subas este archivo a Git** (ya está en `.gitignore`)

### ❌ ¿Qué es el archivo .env?

Variables de entorno (API keys, secrets).

- `.env.example` → Plantilla ✅ (SÍ subir a Git)
- `.env` → Tu configuración real ❌ (NO subir a Git)

**Crear tu .env**:
```bash
cp backend/.env.example backend/.env
```

Luego edita `backend/.env` con tus valores.

---

## 📚 Recursos Externos

### Documentación Oficial
- [Django](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [pnpm](https://pnpm.io/)

### Tutoriales
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [Python para principiantes](https://docs.python.org/es/3/tutorial/)
- [JavaScript moderno](https://javascript.info/)

### Herramientas
- [Python Tutor](https://pythontutor.com/) - Visualiza código paso a paso
- [Postman](https://www.postman.com/) - Prueba APIs
- [React DevTools](https://react.dev/learn/react-developer-tools) - Extensión navegador

---

## 🆘 Aún Tengo Problemas

1. **Busca en este FAQ**
2. **Revisa** [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) y [GUIA_CONTRIBUCION.md](./GUIA_CONTRIBUCION.md)
3. **Vuelve al índice** → [00_INDEX.md](./00_INDEX.md)
4. **Pregunta en el chat del equipo**
5. **Crea un issue en GitHub** describiendo el problema

**Formato del issue**:
```
Título: [Error] Descripción breve

**¿Qué intentabas hacer?**
(describe)

**¿Qué pasó?**
(describe el error)

**¿Qué ya probaste?**
(lista lo que intentaste)

**Logs/Capturas**
(pega el error completo)
```

¡El equipo está aquí para ayudar! 🚀
