# Configuración del Frontend - Atmos

Esta guía te ayudará a poner en marcha el frontend de Atmos, construido con **React + Vite**.

## Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js 18 o superior**
- **npm** (viene incluido con Node.js)

### Verificar instalación

Abre una terminal y ejecuta:

```bash
node --version
npm --version
```

Deberías ver las versiones instaladas. Por ejemplo:

```
v18.17.0
9.8.1
```

Si no tienes Node.js, descárgalo desde: https://nodejs.org/

---

## Pasos para configurar el frontend

### 1. Navega a la carpeta del frontend

Desde la raíz del proyecto:

```bash
cd frontend
```

### 2. Instala las dependencias

En este proyecto usamos **pnpm** por su velocidad y eficiencia. Ejecuta:

```bash
pnpm install
```

Este comando instalará:
- React
- React DOM
- Vite (herramienta de desarrollo)
- Todas las demás dependencias necesarias

La instalación con pnpm es más rápida que npm y ocupa menos espacio en disco.

#### Si no tienes pnpm instalado:

```bash
# Instalar pnpm globalmente
npm install -g pnpm
```

#### Alternativa con npm (si es necesario):

```bash
npm install
```

---

## Ejecutar el servidor de desarrollo

Con las dependencias instaladas, ejecuta:

```bash
pnpm dev
```

O si usas npm:

```bash
npm run dev
```

### Salida esperada:

```
  VITE v5.0.8  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

El servidor se abrirá automáticamente en tu navegador en: **http://localhost:5173**

### ⚡ Recarga en caliente

Vite detecta cambios en el código y actualiza el navegador automáticamente. No necesitas recargar manualmente.

---

## Probar la aplicación

Una vez que el servidor esté corriendo, verás la aplicación de Atmos en tu navegador.

### Páginas disponibles:

Puedes navegar usando el menú superior o visitando directamente:

- **Dashboard** → http://localhost:5173/
  - Vista principal con resumen meteorológico (datos de ejemplo)
  
- **Login** → http://localhost:5173/login
  - Formulario de inicio de sesión (aún no funcional)
  
- **Panel de Usuario** → http://localhost:5173/panel
  - Información de usuario y configuración (datos de ejemplo)

### ¿Qué verás?

- **Navbar** con enlaces de navegación
- **Contenido principal** de cada página
- **Footer** con información del proyecto
- Datos de ejemplo estáticos (se conectarán a la API más adelante)

---

## Conectar con el backend

El frontend está preparado para comunicarse con el backend a través del archivo `src/services/apiClient.js`.

### 1. Asegúrate de que el backend está corriendo

Sigue la guía `docs/backend-setup.md` para levantar el backend en: http://localhost:8000

### 2. Probar la conexión

Puedes probar la conexión desde la consola del navegador (F12):

```javascript
import { apiClient } from './services/apiClient'

// Probar endpoint de salud
const data = await apiClient('/health')
console.log(data)
```

Deberías ver:

```json
{
  "status": "ok",
  "app": "Atmos backend"
}
```

---

## Construir para producción

Cuando quieras crear una versión optimizada para desplegar:

```bash
pnpm build
```

Esto generará una carpeta `dist/` con los archivos optimizados.

### Previsualizar la versión de producción:

```bash
pnpm preview
```

Esto sirve la versión construida en http://localhost:4173

---

## Detener el servidor

Para detener el servidor de desarrollo, presiona `Ctrl + C` en la terminal donde está corriendo.

---

## Estructura del frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # Barra de navegación
│   │   │   └── Footer.jsx         # Pie de página
│   │   ├── dashboard/
│   │   │   └── DashboardSummary.jsx   # Tarjetas de resumen
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
├── package.json                    # Dependencias y scripts
├── vite.config.js                  # Configuración de Vite
└── README.md
```

---

## Próximos pasos

Una vez que tengas el frontend funcionando, los siguientes pasos son:

1. Conectar los componentes con la API real del backend
2. Implementar autenticación con JWT
3. Crear gráficas de datos meteorológicos
4. Añadir sistema de alertas
5. Implementar gestión de usuarios
6. Mostrar histórico de datos

---

## Solución de problemas

### Error: "node no se reconoce como comando"

Instala Node.js desde https://nodejs.org/ y reinicia la terminal.

### Error: "pnpm install" falla

1. Elimina la carpeta `node_modules/` y el archivo `pnpm-lock.yaml`
2. Ejecuta `pnpm install` de nuevo

Si el problema persiste, intenta limpiar la caché:

```bash
pnpm store prune
pnpm install
```

### Puerto 5173 ya en uso

Vite elegirá automáticamente otro puerto (5174, 5175, etc.). Revisa la terminal para ver cuál está usando.

O puedes especificar uno manualmente en `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Los cambios no se reflejan en el navegador

1. Asegúrate de guardar el archivo (`Ctrl + S`)
2. Vite debería recargar automáticamente
3. Si no funciona, recarga manualmente el navegador (`F5`)

### Error de CORS al conectar con el backend

El backend ya tiene CORS configurado para `http://localhost:5173`. Si usas otro puerto:

1. Ve a `backend/app/core/config.py`
2. Añade tu puerto a `CORS_ORIGINS`:

```python
CORS_ORIGINS: list = [
    "http://localhost:5173",
    "http://localhost:3000",  # Añade tu puerto aquí
]
```

---

## Comandos útiles con pnpm

```bash
# Instalar dependencias
pnpm install

# Añadir nueva dependencia
pnpm add nombre-paquete

# Añadir dependencia de desarrollo
pnpm add -D nombre-paquete

# Eliminar dependencia
pnpm remove nombre-paquete

# Actualizar dependencias
pnpm update

# Ver dependencias instaladas
pnpm list
```

## Consejos

- **Usa pnpm** para mantener consistencia con el equipo y aprovechar su velocidad.
- **Mantén el servidor corriendo** mientras trabajas para ver cambios en tiempo real.
- **Usa la consola del navegador** (F12) para ver errores de JavaScript.
- **Revisa React DevTools** para inspeccionar componentes (extensión de navegador).
- **Organiza tus componentes** siguiendo la estructura de carpetas del proyecto.
- **Usa comentarios** para marcar código que se implementará después.
- **Consulta la guía de buenas prácticas** en `docs/best-practices.md`.

---

## Recursos útiles

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

¡Listo! Ya tienes el frontend de Atmos funcionando. 🎨
