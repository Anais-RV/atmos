# 📖 Guía de Contribución - Atmos

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

### 1. Asegúrate de estar en tu rama

```bash
git branch
# Debe mostrar: * feat/tu-funcionalidad
```

Si no estás en una rama `feat/`:

```bash
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
   - **Base**: `dev`
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

## Antes de Hacer Push

- [ ] El código funciona en local
- [ ] No hay `console.log()` olvidados
- [ ] Los imports están ordenados
- [ ] Seguiste las convenciones de nombres
- [ ] Eliminaste código comentado innecesario

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
