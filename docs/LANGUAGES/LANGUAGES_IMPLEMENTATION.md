# Guía de Implementación - Sistema de Idiomas

## ✅ Implementación Completada

Se ha creado un sistema completo de internacionalización (i18n) con soporte para 5 idiomas.

## 📁 Archivos Creados

### Frontend

```
frontend/src/
├── components/features/languages/
│   ├── es.json                           ← Español
│   ├── en.json                           ← Inglés
│   ├── pt.json                           ← Portugués
│   ├── pt_BR.json                        ← Portugués Brasileño
│   ├── ru.json                           ← Ruso
│   ├── index.js                          ← Exportador de traducciones
│   ├── LanguageDebug.jsx                 ← Componente de debug
│   ├── LanguageDebug.css                 ← Estilos de debug
│   ├── validate-translations.js          ← Script de validación
│   └── README.md                         ← Documentación
│
├── context/
│   ├── LanguageContextDef.js             ← Definición del contexto
│   ├── LanguageContext.jsx               ← Proveedor (Provider)
│   └── useLanguage.js                    ← Hook personalizado
│
└── services/
    └── languagesService.js               ← Servicio API

Componentes Modificados:
├── components/ui/HamburgerMenu/HamburgerMenu.jsx
├── components/features/settings/SettingsForm.jsx
└── App.jsx
```

### Backend

```
backend/
├── users/
│   ├── documents.py         ← UserPreferencesDocument actualizado
│   └── serializers.py       ← Validadores de idiomas actualizados
```

## 🔧 Cómo Usar

### 1. En Componentes React

```jsx
import { useLanguage } from '../../../context/useLanguage';

function MiComponente() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('settings.title')}</h1>
      <button onClick={() => setLanguage('en')}>English</button>
      <p>Idioma actual: {language}</p>
    </div>
  );
}
```

### 2. Función de Traducción

```jsx
const { t } = useLanguage();

// Acceso con notación de punto
t('common.loading')           // "Cargando..."
t('hamburger.userMenu')       // "Menú de usuario"
t('settings.language')        // "Idioma"

// Si la clave no existe, devuelve la clave misma
t('no.existe')               // "no.existe"
```

### 3. Cambiar Idioma

```jsx
const { setLanguage } = useLanguage();

// Cambiar a un idioma específico
setLanguage('es');     // Español
setLanguage('en');     // Inglés
setLanguage('pt');     // Portugués
setLanguage('pt_BR');  // Portugués Brasileño
setLanguage('ru');     // Ruso
```

## 🔀 Flujo de Datos

```
┌─────────────────────────────────────────────────────┐
│            App inicia                               │
│  (LanguageProvider envuelve toda la app)            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  LanguageContext.jsx busca idioma:                  │
│  1. localStorage ('app_language')                   │
│  2. Backend (si está autenticado)                   │
│  3. Sistema del navegador o español por defecto     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Carga el archivo JSON de traducción                │
│  (es.json, en.json, etc.)                           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  LanguageContext proporciona:                       │
│  - t() función para traducir                        │
│  - language idioma actual                           │
│  - setLanguage() para cambiar                       │
│  - translations objeto con todas las claves         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Componentes usan useLanguage() hook                │
│  para acceder a las traducciones                    │
└─────────────────────────────────────────────────────┘
```

## 💾 Persistencia

### Usuario NO Autenticado
- Cambios guardados en `localStorage` bajo clave `app_language`
- Persiste entre recargas de página
- No se sincroniza con backend

### Usuario Autenticado
- Cambios guardados en `localStorage` (inmediato)
- Cambios sincronizados con MongoDB en backend
- Persiste entre recargas y dispositivos

## 🔄 Sincronización con Preferencias

El idioma está integrado con `PreferencesContext`:

```jsx
// Cambiar idioma desde HamburgerMenu
const { setLanguage } = useLanguage();
setLanguage('en');  // ✅ Se guarda en localStorage
                    // ✅ Se sincroniza con MongoDB (si autenticado)

// Cambiar idioma desde SettingsForm
// El formulario ya maneja la sincronización
```

## 🧪 Testing

### Método 1: Usar LanguageDebug (Recomendado)

```jsx
// En una página (ej: SettingsPage.jsx)
import LanguageDebug from '../components/features/languages/LanguageDebug';

export default function SettingsPage() {
  return (
    <>
      <LanguageDebug />  {/* Panel de debug */}
      {/* Resto del contenido */}
    </>
  );
}
```

### Método 2: Prueba Manual

1. **Sin autenticación**:
   ```
   - Abre la app
   - Abre DevTools (F12)
   - Console: localStorage.getItem('app_language')
   - Ve a HamburgerMenu → Idiomas → Elige uno
   - Recarga la página
   - El idioma debe persistir
   ```

2. **Con autenticación**:
   ```
   - Inicia sesión
   - Ve a Settings
   - Cambia el idioma
   - Haz clic en "Guardar cambios"
   - Recarga la página
   - El idioma debe persister y estar en MongoDB
   ```

## 📝 Estructura de Traducciones

Cada archivo JSON tiene esta estructura:

```json
{
  "common": {
    "loading": "Cargando...",
    "error": "Error",
    "save": "Guardar",
    ...
  },
  "hamburger": {
    "userMenu": "Menú de usuario",
    "languages": "Idiomas",
    ...
  },
  "settings": {
    "title": "Configuración",
    "language": "Idioma",
    ...
  },
  "auth": { ... },
  "weather": { ... },
  "dashboard": { ... }
}
```

## 🚀 Características Principales

✅ **5 Idiomas soportados**: Español, Inglés, Portugués, Portugués Brasileño, Ruso

✅ **Persistencia dual**: localStorage para inmediatez, MongoDB para sincronización

✅ **Funciona sin autenticación**: Usuarios anónimos también pueden cambiar idioma

✅ **Sincronización automática**: Si el usuario se autentica, se sincroniza con backend

✅ **Cambio inmediato**: La UI se actualiza sin recargar

✅ **Integrado con preferencias**: El idioma se guarda junto con tema y estación favorita

✅ **Menú de idiomas funcional**: HamburgerMenu tiene opción para cambiar idioma

✅ **Formulario de configuración**: SettingsForm permite cambiar idioma

✅ **Hook personalizado**: `useLanguage()` para acceder desde cualquier componente

✅ **Validación backend**: MongoDB y serializers validan los idiomas permitidos

## ❌ Posibles Errores y Soluciones

### Error: "useLanguage debe usarse dentro de un LanguageProvider"

**Solución**: Asegúrate de que el componente esté dentro del árbol de LanguageProvider en App.jsx

```jsx
<LanguageProvider>
  <TuComponente />
</LanguageProvider>
```

### La traducción devuelve la clave en lugar del valor

**Posibles causas**:
- La clave está mal escrita
- La clave no existe en el archivo JSON
- El archivo JSON tiene un error de sintaxis

**Solución**:
- Verifica que la clave exista exactamente igual en es.json
- Usa `validate-translations.js` para verificar consistencia

### Los cambios de idioma no persisten

**Para usuario NO autenticado**:
- Verifica que localStorage esté habilitado en el navegador

**Para usuario autenticado**:
- Verifica que el token sea válido
- Revisa la consola del navegador para errores
- Verifica que el backend esté respondiendo correctamente

## 🔐 Validación

### Frontend
- Solo permite idiomas registrados en `LANGUAGE_TRANSLATIONS`
- Fallback automático a español si hay error

### Backend (MongoDB)
- Campo `language` con `choices=['es', 'en', 'pt', 'pt_BR', 'ru']`
- Serializers validan contra esta lista
- No permite valores inválidos

## 📊 Estadísticas

- **5 idiomas** completamente traducidos
- **6 categorías** de traducción (common, hamburger, settings, auth, weather, dashboard)
- **80+ claves de traducción** por idioma
- **2 componentes principales** integrados (HamburgerMenu, SettingsForm)
- **100% compatible** con usuarios autenticados y anónimos

## 🎯 Próximos Pasos (Opcionales)

1. **Añadir más idiomas**: Sigue la guía en [CONTRIBUTING.md](./README.md#cómo-añadir-un-nuevo-idioma)

2. **Mejorar traducciones**: Edita los archivos JSON según sea necesario

3. **Traducir más componentes**: Importa `useLanguage` en otros componentes

4. **Agregar detección de idioma del sistema**: Ya está implementado como fallback

5. **Crear página de idiomas**: Página dedicada para cambiar idioma (opcional)

## 📞 Soporte

Para problemas o preguntas:

1. Verifica el README.md en `frontend/src/components/features/languages/`
2. Usa el componente LanguageDebug para diagnosticar
3. Revisa la consola del navegador para errores
4. Verifica los logs del backend

---

**Sistema de Idiomas - Completamente Implementado ✅**

Versión: 1.0.0
Última actualización: 2025-01-21
