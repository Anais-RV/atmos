# 📖 Guía de Contribución - Atmos

> **📌 IMPORTANTE:** Este proyecto está actualmente en **Fase 2 (v2.0)**, desarrollándose en la rama `beta`.  
> Si necesitas hacer cambios para v1.0, consulta la sección ["Rama de destino"](#rama-de-destino).

---

## Rama de Destino

### Desarrollo activo (v2.0) → `beta`

El equipo reducido que continúa el proyecto trabaja sobre la rama **`beta`**, que contiene:
- ✅ Migración completa a MongoDB
- ✅ Mejoras en UX (selector de ciudades con chips colapsables)
- ✅ Optimizaciones de rendimiento y CSS responsive
- 🚧 Nuevas funcionalidades en desarrollo

**Todas las PRs deben ir a `beta` por defecto.**

### Mantenimiento estable (v1.0) → `dev`

Solo para hotfixes críticos de la versión 1.0 (bugs bloqueantes, seguridad).

---

## Formato de Commits

```
tipo: descripción breve
```

### Tipos de commit

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `style:` Cambios de CSS/formato
- `refactor:` Mejora de código
- `docs:` Cambios en documentación
- `test:` Añadir/modificar tests

### Ejemplos

```bash
feat: añade formulario de registro
fix: corrige cálculo de temperatura promedio
style: ajusta espaciado en navbar
docs: actualiza guía de setup
```

---

## Crear Pull Request (3 pasos)

### 0. Verifica la rama base

Para **v2.0 (desarrollo activo)** → PR hacia `beta`  
Para **v1.0 (hotfix crítico)** → PR hacia `dev`

### 1. Asegúrate de estar en tu rama

```bash
git branch
# Debe mostrar: * feat/tu-funcionalidad
```

Si no estás en una rama `feat/`:

```bash
# Para v2.0:
git checkout beta
git pull origin beta
git checkout -b feat/nombre-descriptivo

# Para v1.0:
git checkout dev
git pull origin dev
git checkout -b feat/nombre-descriptivo
```

### 2. Sube tus cambios

```bash
git push -u origin feat/tu-funcionalidad
```

### 3. Abre PR en GitHub

1. Ve a https://github.com/Anais-RV/atmos/pulls
2. Click **"New Pull Request"**
3. Selecciona:
   - **Base**: `beta` (v2.0 - por defecto) o `dev` (v1.0 - solo hotfixes)
   - **Compare**: `feat/tu-funcionalidad`
4. Rellena la plantilla que aparece
5. Click **"Create Pull Request"**

**Espera revisión** → Una vez aprobado → **Haz merge**

---

## Dónde Poner Cada Archivo

### Backend

```
backend/
├── nombre_app/
│   ├── models.py        → Modelos de base de datos
│   ├── views.py         → Lógica de vistas/endpoints
│   ├── serializers.py   → Serializers de DRF
│   ├── urls.py          → URLs de la app
│   ├── admin.py         → Config del admin Django
│   └── tests.py         → Tests de la app
```

**Crear nueva app**:
```bash
cd backend
python manage.py startapp nombre_app
```

Luego añade `'nombre_app'` a `INSTALLED_APPS` en `config/settings.py`

### Frontend

```
frontend/src/
├── components/          → Componentes reutilizables
│   ├── auth/           → Login, registro, etc.
│   ├── charts/         → Gráficas
│   ├── history/        → Histórico de datos
│   └── layout/         → Navbar, Footer
├── pages/              → Páginas completas
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   └── UserPanelPage.jsx
├── services/           → Llamadas a la API
│   └── apiClient.js
└── styles/             → Estilos globales CSS
```

**Regla simple**:
- ¿Es reutilizable? → `components/`
- ¿Es una página completa? → `pages/`
- ¿Llama a la API? → `services/`

---

## Convenciones de Código

### Nombres de Archivos

**Frontend**:
- Componentes: `UserCard.jsx` (PascalCase)
- Páginas: `DashboardPage.jsx` (PascalCase + Page)
- Servicios: `apiClient.js` (camelCase)

**Backend**:
- Siempre: `models.py`, `views.py`, etc. (snake_case)

### Python (Backend)

```python
# ✅ Nombres descriptivos
def get_average_temperature():
    return WeatherData.objects.aggregate(Avg('temperature'))

# ✅ Usa docstrings
def calculate_total(price: float, quantity: int) -> float:
    """Calcula el total multiplicando precio por cantidad."""
    return price * quantity

# ❌ Evita nombres crípticos
def gat():  # ¿Qué hace esto?
    return x
```

### JavaScript (Frontend)

```jsx
// ✅ Componentes con function
export default function UserCard() {
  return <div>...</div>
}

// ✅ Props desestructuradas
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>
}

// ❌ Evita export default con arrow function
export default () => <div>...</div>  // ❌
```

### CSS

```css
/* ✅ Nombres descriptivos con guiones */
.user-card { }
.dashboard-header { }

/* ❌ Evita nombres cortos poco claros */
.uc { }  /* ¿Qué es esto? */
```

---

## Buenas Prácticas de Código

### Python (Backend)

```python
# ✅ Nombres descriptivos en snake_case
def get_average_temperature():
    return WeatherData.objects.aggregate(Avg('temperature'))

# ✅ Type hints
def calculate_total(price: float, quantity: int) -> float:
    """Calcula el total multiplicando precio por cantidad."""
    return price * quantity

# ✅ Usa f-strings
message = f"Temperatura: {temp}°C"

# ❌ Evita nombres poco claros
def gat():  # ¿Qué hace?
    return x
```

**ORM y consultas:**
```python
# ✅ Usa select_related para ForeignKey (evita N+1)
users = User.objects.select_related('profile').all()

# ✅ Usa exists() para verificar
if WeatherData.objects.filter(temp__gt=40).exists():
    # ...

# ❌ No hagas esto (carga toda la tabla)
if len(WeatherData.objects.all()) > 0:
    # ...
```

### JavaScript/React (Frontend)

```jsx
// ✅ Componentes con function (no arrow)
export default function UserCard() {
  return <div>...</div>
}

// ✅ Desestructura props
function Button({ text, onClick, variant = 'primary' }) {
  return <button onClick={onClick}>{text}</button>
}

// ✅ useEffect con dependencias correctas
useEffect(() => {
  fetchData(userId)
}, [userId])  // Incluye todas las dependencias

// ❌ Evita modificar estado directamente
state.items.push(newItem)  // ❌ Mal
setItems([...items, newItem])  // ✅ Bien
```

**Llamadas a API:**
```jsx
// ✅ Maneja errores
try {
  const data = await apiClient.get('/endpoint')
  setData(data)
} catch (error) {
  console.error('Error:', error)
  // Muestra mensaje al usuario
}

// ❌ No hagas fetch directo en el render
```

### Git: Flujo de Ramas

**Regla de oro**: NUNCA trabajes directamente en `main` o `dev`

```bash
# ✅ Siempre crea una rama feat/
git checkout dev
git pull origin dev
git checkout -b feat/mi-funcionalidad

# ✅ Mantén tu rama actualizada
git checkout dev
git pull origin dev
git checkout feat/mi-funcionalidad
git merge dev

# ❌ No hagas push directo a dev/main
```

**Resolución de conflictos:**
1. Git marca conflictos con `<<<<`, `====`, `>>>>`
2. Abre el archivo y decide qué código mantener
3. Elimina las marcas
4. `git add .` y `git commit -m "merge: resuelve conflictos"`

---

## Antes de Hacer Push

- [ ] El código funciona en local
- [ ] No hay `console.log()` olvidados
- [ ] Los imports están ordenados
- [ ] Seguiste las convenciones de nombres
- [ ] Eliminaste código comentado innecesario
- [ ] Si usas ORM, evitaste queries N+1
- [ ] Los useEffect tienen las dependencias correctas

---

## Qué NO Hacer

❌ No hacer push directo a `main` o `dev`  
❌ No subir archivos `.env` con credenciales  
❌ No subir `node_modules/` o `venv/`  
❌ No hacer commits gigantes (mejor varios pequeños)  
❌ No copiar/pegar código sin entenderlo  

---

## Flujo Completo (Resumen)

```bash
# 1. Actualizar dev
git checkout dev
git pull origin dev

# 2. Crear tu rama
git checkout -b feat/mi-feature

# 3. Programar y hacer commits
git add .
git commit -m "feat: mi cambio"

# 4. Subir
git push -u origin feat/mi-feature

# 5. Abrir PR en GitHub
# (De feat/mi-feature → dev)

# 6. Esperar revisión y merge
```

---

## ¿Dudas?

- **Problemas técnicos** → [FAQ.md](./FAQ.md)
- **Setup inicial** → [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- **Volver al índice** → [00_INDEX.md](./00_INDEX.md)
- **Pregunta al equipo** antes de inventar

Es mejor preguntar que romper `dev` 🚀
