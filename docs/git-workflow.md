# Flujo de trabajo con Git en Atmos

Este documento define cómo trabajar con Git y GitHub en el repositorio de Atmos. Siguiendo estas normas evitarás conflictos, pérdidas de código y problemas con el equipo. **Importante**: no se trabaja directamente sobre las ramas `main` ni `dev`.

---

## Ramas del proyecto

El repositorio está organizado en tres tipos de ramas:

- **`main`**: Código estable y funcional, listo para mostrar en demos. Solo se actualiza mediante Pull Requests aprobados desde `dev`.

- **`dev`**: Rama de integración del equipo. Aquí se juntan todas las features antes de pasar a `main`. Sirve para probar que todo funciona junto.

- **`feat/*`**: Ramas de trabajo individual. Cada miembro del equipo crea una rama nueva para cada funcionalidad o tarea específica.

### Ejemplos de nombres de ramas feature:

- `feat/dashboard-inicial`
- `feat/auth-login`
- `feat/api-estacion`
- `feat/grafica-temperatura`
- `feat/componente-header`

---

## Primeros pasos: clonar el repositorio

Si es la primera vez que trabajas en el proyecto, clona el repositorio y sitúate en la rama `dev`:

```bash
git clone https://github.com/Anais-RV/atmos.git
cd atmos
git checkout dev
```

Antes de empezar cualquier trabajo nuevo, **siempre verifica que estás en `dev`** y que tienes la última versión.

---

## Crear una rama de feature

Cada vez que vayas a trabajar en una nueva funcionalidad o tarea, sigue estos pasos:

### 1. Asegúrate de estar en `dev` y actualízala

```bash
git checkout dev
git pull origin dev
```

Esto garantiza que partes de la versión más reciente del código compartido.

### 2. Crea tu rama de feature

```bash
git checkout -b feat/nombre-corto
```

Usa nombres descriptivos y concisos. Ejemplos:
- `feat/login-form`
- `feat/api-datos-temperatura`
- `feat/footer-component`

**Recuerda**: cada rama debe centrarse en **una sola funcionalidad o tarea**. No mezcles varias features grandes en la misma rama.

---

## Hacer commits

Trabaja en tu rama haciendo commits pequeños y frecuentes. Esto facilita revisar cambios y revertir errores si es necesario.

### Estructura de mensajes de commit

Usa mensajes descriptivos que expliquen **qué** hiciste:

- `feat: crea layout inicial del dashboard`
- `feat: añade formulario de login`
- `fix: corrige error en cálculo de promedio`
- `style: ajusta espaciado en componente header`
- `docs: actualiza guía de workflow`
- `refactor: reorganiza estructura de carpetas`

### Comandos básicos

```bash
git add .
git commit -m "mensaje descriptivo"
```

O añade archivos específicos:

```bash
git add src/components/Header.jsx
git commit -m "feat: añade componente Header"
```

---

## Subir la rama al remoto

Cuando tengas cambios listos para compartir o quieras hacer backup de tu trabajo, sube tu rama a GitHub:

```bash
git push -u origin feat/nombre-corto
```

El flag `-u` solo es necesario la primera vez. En siguientes ocasiones puedes usar simplemente:

```bash
git push
```

---

## Abrir un Pull Request

Cuando termines tu funcionalidad y quieras integrarla al código del equipo, abre un Pull Request (PR) en GitHub.

### Configuración del PR

- **Base**: `dev`
- **Compare**: `feat/tu-rama`

**Nunca hagas un PR directamente a `main`**. Todos los PRs van de `feat/*` → `dev`.

### Contenido del PR

Incluye en la descripción:

1. **Resumen breve**: qué hace esta feature.
2. **Lista de cambios**: qué archivos o componentes modificaste.
3. **Cómo probar**: pasos para verificar que funciona.
4. **Referencia a Issue**: si aplica, añade `Closes #N` para cerrar automáticamente la issue relacionada.

### Ejemplo de descripción:

```
## Resumen
Añade el componente Header con logo y menú de navegación.

## Cambios
- Crea componente `Header.jsx`
- Añade estilos en `Header.module.css`
- Integra Header en `App.jsx`

## Cómo probar
1. Ejecuta `npm run dev`
2. Verifica que el header aparece en la parte superior
3. Comprueba que los enlaces de navegación funcionan

Closes #12
```

---

## Mantener la rama actualizada con `dev`

Si `dev` avanza mientras trabajas (porque otros miembros han mergeado sus PRs), debes actualizar tu rama para evitar conflictos:

### 1. Actualiza `dev` localmente

```bash
git checkout dev
git pull origin dev
```

### 2. Vuelve a tu rama y trae los cambios

```bash
git checkout feat/nombre-corto
git merge dev
```

### 3. Resuelve conflictos si los hay

Si Git te avisa de conflictos, ábrelos en tu editor, resuélvelos manualmente y luego:

```bash
git add .
git commit -m "merge: integra cambios de dev"
git push
```

---

## Normas básicas

### ❌ NO hacer:

- No hacer `push` directo a `main`.
- No hacer `push` directo a `dev`.
- No trabajar directamente en `main` ni en `dev`, solo en ramas `feat/*`.
- No mezclar varias features grandes en la misma rama.
- No ignorar conflictos o "sobreescribir" cambios de otros.

### ✅ SÍ hacer:

- Siempre partir de `dev` al crear una rama nueva.
- Hacer commits pequeños y con mensajes claros.
- Subir tu rama frecuentemente para evitar pérdidas.
- Pedir revisión antes de mergear tu PR.
- Avisar al equipo si algo se rompe en `dev`.
- Actualizar tu rama si `dev` ha avanzado.

---

## Cierre

Seguir este flujo de trabajo garantiza que el equipo pueda colaborar de forma ordenada, sin conflictos ni pérdidas de código. Git es una herramienta poderosa, pero requiere disciplina. Si cada uno sigue estas normas, el proyecto avanzará de forma fluida y profesional.

**Ante cualquier duda, consulta con el equipo antes de hacer cambios en ramas compartidas.**
