# Frontend - Atmos

Aplicación frontend construida con **React + Vite** para el proyecto Atmos.

## Requisitos

- Node.js 18 o superior
- npm (viene incluido con Node.js)

## Configuración inicial

### 1. Instalar dependencias

En este proyecto usamos **pnpm**. Desde la carpeta `frontend/`, ejecuta:

```bash
pnpm install
```

Si no tienes pnpm instalado:

```bash
npm install -g pnpm
```

Alternativamente, puedes usar npm:

```bash
npm install
```

### 2. Configurar variables de entorno (opcional)

Si necesitas cambiar la URL de la API, crea un archivo `.env` en la raíz del frontend:

```
VITE_API_URL=http://localhost:8000
```

## Ejecutar el servidor de desarrollo

Con las dependencias instaladas, ejecuta:

```bash
pnpm dev
```

O con npm:

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

El servidor se recargará automáticamente cuando hagas cambios en el código.

## Rutas disponibles

La aplicación tiene las siguientes rutas:

- **`/`** - Dashboard principal con resumen meteorológico
- **`/login`** - Página de inicio de sesión
- **`/panel`** - Panel de usuario (información y configuración)

Puedes navegar entre ellas usando el menú superior.

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # Barra de navegación
│   │   │   └── Footer.jsx         # Pie de página
│   │   ├── dashboard/
│   │   │   └── DashboardSummary.jsx   # Resumen de datos
│   │   └── auth/
│   │       └── LoginForm.jsx      # Formulario de login
│   ├── pages/
│   │   ├── DashboardPage.jsx      # Página principal
│   │   ├── LoginPage.jsx          # Página de login
│   │   └── UserPanelPage.jsx      # Panel de usuario
│   ├── services/
│   │   └── apiClient.js           # Cliente HTTP para la API
│   ├── App.jsx                    # Componente raíz con rutas
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Conectar con el backend

El archivo `src/services/apiClient.js` proporciona una función para hacer peticiones a la API:

```javascript
import { apiClient } from './services/apiClient'

// Ejemplo de uso
const data = await apiClient('/health')
console.log(data)
```

Por defecto, apunta a `http://localhost:8000`. Asegúrate de que el backend está corriendo antes de hacer peticiones.

## Construir para producción

Para crear una versión optimizada de producción:

```bash
pnpm build
```

Los archivos generados estarán en la carpeta `dist/`.

Para previsualizar la versión de producción:

```bash
pnpm preview
```

## Próximos pasos

Este es el esqueleto inicial del frontend. A partir de aquí se implementará:

- Integración real con la API del backend
- Autenticación con JWT
- Gráficas de datos meteorológicos
- Sistema de alertas
- Gestión de usuarios
- Histórico de datos

## Comandos útiles

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Construir para producción
pnpm build

# Previsualizar build de producción
pnpm preview

# Añadir nueva dependencia
pnpm add nombre-paquete

# Añadir dependencia de desarrollo
pnpm add -D nombre-paquete
```

## Notas

- Este proyecto usa **pnpm** como gestor de paquetes.
- Los componentes actuales muestran datos de ejemplo estáticos.
- El formulario de login no está conectado a la API todavía.
- Los estilos son básicos y se mejorarán en siguientes fases.
- Toda la lógica de autenticación y peticiones a la API se implementará más adelante.
- **Consulta `docs/best-practices.md`** para guía de buenas prácticas.
