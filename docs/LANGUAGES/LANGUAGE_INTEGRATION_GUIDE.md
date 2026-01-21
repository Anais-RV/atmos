# 🎨 GUÍA DE INTEGRACIÓN - TRADUCIR MÁS COMPONENTES

Esta guía explica cómo integrar el sistema de idiomas en otros componentes de la aplicación.

---

## 📋 Pasos Básicos

### 1. Importar el Hook
```jsx
import { useLanguage } from '../context/useLanguage';
```

### 2. Usar en el Componente
```jsx
function MiComponente() {
  const { t } = useLanguage();
  // ...
}
```

### 3. Reemplazar Textos
```jsx
// Antes:
<h1>Bienvenido</h1>

// Después:
<h1>{t('dashboard.welcome')}</h1>
```

---

## 🔍 Identificar Textos a Traducir

1. **Abierto al usuario**: Todos los textos visibles
2. **Etiquetas y placeholders**: Labels, hints, tooltips
3. **Mensajes dinámicos**: Errores, éxito, validación
4. **Botones**: Todos los textos de botones
5. **Placeholders**: Atributos `placeholder`, `title`, `aria-label`

NO traducir:
- Nombres de usuarios o datos del usuario
- IDs técnicos o códigos de error
- Nombres de ciudades (generalmente)
- Valores numéricos

---

## 🔧 Ejemplos Prácticos

### Ejemplo 1: Componente Simple
```jsx
// ANTES
function LoginForm() {
  return (
    <form>
      <label>Correo electrónico</label>
      <input placeholder="Ingresa tu email" />
      <button>Iniciar sesión</button>
      <a href="/password-reset">¿Olvidaste tu contraseña?</a>
    </form>
  );
}

// DESPUÉS
import { useLanguage } from '../context/useLanguage';

function LoginForm() {
  const { t } = useLanguage();

  return (
    <form>
      <label>{t('auth.email')}</label>
      <input placeholder={t('auth.email')} />
      <button>{t('auth.login')}</button>
      <a href="/password-reset">{t('auth.forgotPassword')}</a>
    </form>
  );
}
```

### Ejemplo 2: Mensajes de Error
```jsx
// ANTES
function UserForm() {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('El email es requerido');
      return;
    }
  };

  return (
    <>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {/* formulario */}
    </>
  );
}

// DESPUÉS
import { useLanguage } from '../context/useLanguage';

function UserForm() {
  const { t } = useLanguage();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('auth.email') + ' ' + t('common.error'));
      return;
    }
  };

  return (
    <>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {/* formulario */}
    </>
  );
}
```

### Ejemplo 3: Condicionales
```jsx
// ANTES
function WeatherCard({ weather }) {
  return (
    <div>
      {weather.isLoading && <p>Cargando...</p>}
      {weather.error && <p>Error: {weather.error}</p>}
      {!weather.isLoading && !weather.error && (
        <div>
          <p>Temperatura: {weather.temp}°C</p>
          <p>Humedad: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}

// DESPUÉS
import { useLanguage } from '../context/useLanguage';

function WeatherCard({ weather }) {
  const { t } = useLanguage();

  return (
    <div>
      {weather.isLoading && <p>{t('common.loading')}</p>}
      {weather.error && <p>{t('common.error')}: {weather.error}</p>}
      {!weather.isLoading && !weather.error && (
        <div>
          <p>{t('weather.temperature')}: {weather.temp}°C</p>
          <p>{t('weather.humidity')}: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Categorizar por Dominio

Antes de crear nuevas claves, verifica si la traducción ya existe:

```jsx
// BUSCA PRIMERO EN ESTAS CATEGORÍAS

// Para textos generales
t('common.save')
t('common.loading')

// Para navegación
t('navigation.dashboard')
t('navigation.settings')

// Para menús
t('hamburger.darkMode')

// Para configuración
t('settings.language')
t('settings.themeMode')

// Para autenticación
t('auth.email')
t('auth.password')

// Para datos meteorológicos
t('weather.temperature')
t('weather.humidity')

// Para el dashboard
t('dashboard.welcome')
t('dashboard.noData')
```

Si la clave NO existe, necesitas agregarla a todos los JSON.

---

## ➕ Agregar Nuevas Traducciones

### 1. Identificar la Categoría
¿De qué se trata la traducción?
- General → `common.*`
- Navegación → `navigation.*`
- Validación → Crear `validation.*` si no existe
- Mensajes → Crear `messages.*` si no existe

### 2. Agregar a TODOS los JSONs

```json
// frontend/src/components/features/languages/es.json
{
  "common": {
    "loading": "Cargando...",
    "error": "Error",
    "miNuevaTraduccion": "Mi valor en español"
  }
}
```

```json
// frontend/src/components/features/languages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "miNuevaTraduccion": "My value in English"
  }
}
```

**Repite para pt.json, pt_BR.json, ru.json**

### 3. Validar
```bash
node frontend/src/components/features/languages/validate-translations.js
```

### 4. Usar en el Componente
```jsx
const { t } = useLanguage();
return <p>{t('common.miNuevaTraduccion')}</p>;
```

---

## 🎯 Componentes por Traducir

### Prioridad Alta (Visible a usuarios)
- [ ] `pages/DashboardPage.jsx`
- [ ] `pages/LoginPage.jsx`
- [ ] `pages/RegisterPage.jsx`
- [ ] `pages/UserPanelPage.jsx`
- [ ] `pages/ForecastPage.jsx`
- [ ] `pages/WeatherHistoryPage.jsx`
- [ ] `components/layout/Navbar.jsx`
- [ ] `components/layout/Footer.jsx`

### Prioridad Media
- [ ] `pages/SettingsPage.jsx` (SettingsForm ya está)
- [ ] `pages/TagsPage.jsx`
- [ ] `pages/PasswordResetPage.jsx`
- [ ] `components/features/auth/*.jsx`

### Prioridad Baja
- [ ] `pages/DataProtectionPage.jsx`
- [ ] Componentes internos

---

## 🔄 Checklist de Traducción

Para cada componente que traduces:

- [ ] Importas `useLanguage`
- [ ] Obtienes `t` del hook
- [ ] Todos los textos visibles usan `t()`
- [ ] Las claves existen en todos los JSON
- [ ] Ejecutaste `validate-translations.js`
- [ ] Probaste cambiando de idioma
- [ ] Los mensajes de error se ven bien
- [ ] Los placeholders son apropiados

---

## 🧪 Testing de Traducción

### 1. Test Manual
1. Traducir componente
2. Cambiar idioma desde HamburgerMenu
3. Verificar que TODO cambia de idioma
4. Recargar página → verificar persistencia

### 2. Test Automático
```bash
node frontend/src/components/features/languages/validate-translations.js
```

### 3. Test con Debug
```jsx
import LanguageDebug from '../components/features/languages/LanguageDebug';

// En tu componente de prueba:
<LanguageDebug />
```

---

## ⚠️ Errores Comunes en Integración

### Error 1: Olvidar importar
```jsx
// ❌ INCORRECTO
function MiComponente() {
  return <p>{t('common.loading')}</p>; // t no está definido
}

// ✅ CORRECTO
import { useLanguage } from '../context/useLanguage';

function MiComponente() {
  const { t } = useLanguage();
  return <p>{t('common.loading')}</p>;
}
```

### Error 2: Clave no existe
```jsx
// ❌ INCORRECTO
{t('esta.clave.no.existe')} // Muestra: "esta.clave.no.existe"

// ✅ CORRECTO
// Primero agrega a es.json, en.json, pt.json, pt_BR.json, ru.json
// Luego: {t('categoria.nuevaClave')}
```

### Error 3: Variables dinámicas
```jsx
// ❌ INCORRECTO
const name = 'Juan';
<p>{t(name)}</p> // Intenta traducir "Juan"

// ✅ CORRECTO
const name = 'Juan';
<p>{t('dashboard.welcome')}, {name}</p>
```

### Error 4: Inconsistencia de estructura
```json
// ❌ INCORRECTO - Estructuras diferentes
// es.json
{
  "auth": {
    "email": "Email"
  }
}

// en.json
{
  "auth": {
    "correoElectronico": "Email" // ¡Clave diferente!
  }
}

// ✅ CORRECTO - Misma estructura
// es.json y en.json y todos deben tener "email"
```

---

## 📈 Progreso de Traducción

Use este formato para rastrear progreso:

```markdown
## Estado de Traducción

### Dashboard (En progreso)
- [x] DashboardPage.jsx
- [ ] WeatherCard.jsx
- [ ] ForecastChart.jsx

### Autenticación (Completado)
- [x] LoginPage.jsx
- [x] RegisterPage.jsx
- [x] PasswordResetPage.jsx

### Configuración (Completado)
- [x] SettingsPage.jsx
- [x] SettingsForm.jsx

Completado: 60% (6/10 componentes)
```

---

## 🚀 Tips Avanzados

### Reusabilidad
```jsx
// Crear un hook personalizado para traduciones específicas
export function useAuthMessages() {
  const { t } = useLanguage();
  
  return {
    loginError: t('auth.loginError'),
    registerSuccess: t('auth.registerSuccess'),
    emailInvalid: t('auth.emailInvalid'),
  };
}

// Usar en componentes
function LoginForm() {
  const messages = useAuthMessages();
  // ...
}
```

### Plurales (si se necesita en futuro)
```jsx
// Para futuro soporte de plurales
const { t } = useLanguage();

function itemCount(count) {
  if (count === 1) {
    return t('items.singular');
  }
  return t('items.plural');
}
```

### Espacios de nombres
```jsx
// Agrupar por sección de la app
// "settings.display.language"
// "settings.display.theme"
// "settings.security.password"
```

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa LANGUAGE_EXAMPLES.js
2. Usa LanguageDebug para diagnosticar
3. Corre validate-translations.js
4. Consulta la consola del navegador
5. Revisa LANGUAGES_IMPLEMENTATION.md

---

**Última actualización:** 2025-01-21  
**Versión:** 1.0.0
