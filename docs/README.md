# Documentación del Proyecto Atmos

Bienvenido a la documentación del proyecto **Atmos** - Sistema de gestión de datos meteorológicos.

---

## 📚 Guías Disponibles

### 🚀 Inicio Rápido

1. **[Configuración del Backend](./backend-setup.md)**
   - Cómo instalar y ejecutar el backend FastAPI
   - Configuración de entorno virtual
   - Ejecución de tests
   - Endpoints disponibles

2. **[Configuración del Frontend](./frontend-setup.md)**
   - Cómo instalar y ejecutar el frontend React + Vite
   - Uso de pnpm
   - Rutas disponibles
   - Conexión con el backend

### 📖 Desarrollo

3. **[Flujo de Trabajo con Git](./git-workflow.md)**
   - Cómo usar Git en el proyecto
   - Estructura de ramas (main, dev, feat/*)
   - Crear Pull Requests
   - Normas del equipo

4. **[Guía de Buenas Prácticas](./best-practices.md)**
   - Buenas prácticas para React + Vite
   - Buenas prácticas para FastAPI
   - Gestión de dependencias con pnpm
   - Errores comunes a evitar
   - Consejos de código limpio

---

## 🎯 Orden Recomendado de Lectura

### Para empezar desde cero:

1. Lee el **README.md** principal del proyecto
2. Configura el **backend** siguiendo `backend-setup.md`
3. Configura el **frontend** siguiendo `frontend-setup.md`
4. Aprende el **flujo de Git** en `git-workflow.md`
5. Consulta las **buenas prácticas** en `best-practices.md` antes de programar

### Si ya tienes todo configurado:

- Revisa `git-workflow.md` antes de crear una rama nueva
- Consulta `best-practices.md` cuando tengas dudas sobre cómo estructurar tu código
- Vuelve a las guías de setup si tienes problemas técnicos

---

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno para Python
- **Python 3.10+** - Lenguaje de programación
- **Uvicorn** - Servidor ASGI
- **Pytest** - Framework de testing

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool y dev server
- **pnpm** - Gestor de paquetes (más rápido que npm)
- **JavaScript (ES6+)** - Lenguaje de programación

### Herramientas
- **Git** - Control de versiones
- **GitHub** - Hosting del repositorio

---

## 📁 Estructura del Proyecto

```
atmos/
├── backend/               # API FastAPI
│   ├── app/
│   │   ├── api/v1/       # Endpoints versionados
│   │   ├── core/         # Configuración
│   │   ├── models/       # Modelos de BD
│   │   ├── schemas/      # Schemas Pydantic
│   │   ├── services/     # Lógica de negocio
│   │   └── main.py       # Punto de entrada
│   ├── tests/            # Tests
│   └── README.md
│
├── frontend/             # App React + Vite
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── services/     # API client
│   │   └── App.jsx       # Componente raíz
│   ├── public/           # Archivos estáticos
│   └── README.md
│
├── docs/                 # Documentación
│   ├── README.md         # Este archivo
│   ├── backend-setup.md
│   ├── frontend-setup.md
│   ├── git-workflow.md
│   └── best-practices.md
│
└── README.md             # README principal
```

---

## 🚨 Problemas Comunes

### Backend no arranca
- Verifica que el entorno virtual esté activado
- Confirma que instalaste las dependencias: `pip install -e ".[dev]"`
- Revisa que Python sea 3.10 o superior

### Frontend no arranca
- Verifica que tienes Node.js 18+
- Instala pnpm: `npm install -g pnpm`
- Elimina `node_modules/` y ejecuta `pnpm install` de nuevo

### Error de CORS
- Verifica que el backend está corriendo en `http://localhost:8000`
- Revisa la configuración de CORS en `backend/app/core/config.py`

### Git: No puedo hacer push a main
- ¡Correcto! No se debe hacer push directo a `main`
- Lee `git-workflow.md` para aprender el flujo correcto

---

## 💡 Consejos

- 📖 **Lee las guías completas** antes de empezar a programar
- 🔥 **Haz commits frecuentes** para no perder trabajo
- 🤝 **Comunícate con el equipo** si tienes dudas
- ✅ **Ejecuta tests** antes de hacer un Pull Request
- 📝 **Sigue las buenas prácticas** para mantener el código limpio

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas o tienes dudas:

1. Revisa la documentación relevante en esta carpeta
2. Busca en el historial de Issues de GitHub
3. Pregunta en el canal del equipo
4. Crea un Issue en GitHub con el problema detallado

---

## 📝 Contribuir a la Documentación

Si encuentras algo que falta o que podría mejorarse en la documentación:

1. Crea una rama: `git checkout -b docs/mejora-descripcion`
2. Edita el archivo correspondiente
3. Haz commit: `git commit -m "docs: mejora descripción de setup"`
4. Abre un Pull Request

---

**¡Bienvenido al equipo Atmos!** 🔥

Que los bugs ardan pero el código siga adelante ☕
