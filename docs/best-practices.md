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

## 🚀 Backend - FastAPI

### Estructura del Proyecto

```
backend/
├── app/
│   ├── api/
│   │   └── v1/          # Endpoints versionados
│   ├── core/            # Configuración
│   ├── models/          # Modelos de BD
│   ├── schemas/         # Schemas Pydantic
│   ├── services/        # Lógica de negocio
│   └── main.py
├── tests/               # Tests
└── pyproject.toml
```

### Endpoints y Rutas

#### ✅ Buenas prácticas

```python
# Usa verbos HTTP correctamente
@router.get("/users")           # Listar
@router.get("/users/{id}")      # Obtener uno
@router.post("/users")          # Crear
@router.put("/users/{id}")      # Actualizar completo
@router.patch("/users/{id}")    # Actualizar parcial
@router.delete("/users/{id}")   # Eliminar

# Usa nombres en plural para colecciones
@router.get("/users")           # ✅
@router.get("/user")            # ❌

# Usa path parameters para IDs
@router.get("/users/{user_id}")

# Usa query parameters para filtros
@router.get("/users?role=admin&active=true")
```

#### ❌ Evitar

```python
# ❌ No uses verbos en las URLs
@router.get("/get-users")
@router.post("/create-user")

# ❌ No mezcles estilos
@router.get("/users")
@router.get("/getUserById/{id}")
```

### Schemas Pydantic

```python
# ✅ Separa schemas de entrada y salida
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    # ❌ No devuelvas el password

    class Config:
        from_attributes = True  # Para convertir desde modelos ORM

# ✅ Usa validadores
from pydantic import validator, EmailStr

class UserCreate(BaseModel):
    email: EmailStr  # Validación automática de email
    password: str
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
```

### Dependency Injection

```python
# ✅ Usa Depends para inyectar dependencias
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# ✅ Usa Depends para autenticación
def get_current_user(token: str = Depends(oauth2_scheme)):
    # Validar token
    return user

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
```

### Manejo de Errores

```python
# ✅ Usa HTTPException para errores esperados
from fastapi import HTTPException, status

@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

# ✅ Crea excepciones personalizadas para casos comunes
class UserNotFoundException(HTTPException):
    def __init__(self, user_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
```

### Async/Await

```python
# ✅ Usa async para operaciones I/O
@router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    users = await db.query(User).all()
    return users

# ❌ No uses async si no hay await dentro
# FastAPI puede manejar funciones síncronas
@router.get("/health")
def health_check():  # Sin async si no lo necesitas
    return {"status": "ok"}
```

### Configuración

```python
# ✅ Usa Pydantic Settings para configuración
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Atmos"
    database_url: str
    secret_key: str
    
    class Config:
        env_file = ".env"

settings = Settings()

# ❌ No hardcodees configuración
database_url = "postgresql://user:pass@localhost/db"  # ❌
```

### Testing

```python
# ✅ Usa TestClient para probar endpoints
from fastapi.testclient import TestClient

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

# ✅ Usa fixtures para datos de prueba
import pytest

@pytest.fixture
def test_user():
    return {"email": "test@example.com", "password": "testpass123"}

def test_create_user(test_user):
    response = client.post("/users", json=test_user)
    assert response.status_code == 201
```

### Documentación Automática

```python
# ✅ Añade descripciones a tus endpoints
@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    summary="Obtener usuario por ID",
    description="Devuelve la información de un usuario específico",
    tags=["Users"]
)
def get_user(user_id: int):
    pass

# ✅ Documenta los posibles errores
@router.get(
    "/users/{user_id}",
    responses={
        404: {"description": "Usuario no encontrado"},
        401: {"description": "No autorizado"}
    }
)
def get_user(user_id: int):
    pass
```

### Seguridad

```python
# ✅ Usa CORS correctamente
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Solo orígenes específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ❌ No uses allow_origins=["*"] en producción

# ✅ Hash passwords
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ❌ Nunca guardes passwords en texto plano
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

❌ No retornes objetos ORM directamente
```python
# ❌ Mal
@router.get("/users/{id}")
def get_user(id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == id).first()

# ✅ Bien - usa schemas
@router.get("/users/{id}", response_model=UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    return UserResponse.from_orm(user)
```

❌ No olvides cerrar conexiones de BD
```python
# ✅ Usa context managers o Depends
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  # Siempre se cierra
```

---

## 📚 Recursos Recomendados

### Frontend
- [React Docs (oficial)](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [pnpm Docs](https://pnpm.io/)

### Backend
- [FastAPI Docs (oficial)](https://fastapi.tiangolo.com/)
- [Pydantic Docs](https://docs.pydantic.dev/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)

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
