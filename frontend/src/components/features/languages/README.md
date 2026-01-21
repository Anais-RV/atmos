# Sistema de Idiomas - Atmos

## Descripción

Sistema completo de internacionalización (i18n) para la aplicación Atmos. Permite cambiar dinámicamente el idioma de la interfaz en cinco idiomas: Español, Inglés, Portugués, Portugués Brasileño y Ruso.

## Idiomas Soportados

- 🇪🇸 **Español** (`es`)
- 🇺🇸 **Inglés** (`en`)
- 🇵🇹 **Portugués** (`pt`)
- 🇧🇷 **Portugués Brasileño** (`pt_BR`)
- 🇷🇺 **Ruso** (`ru`)

## Estructura

### Frontend

```
frontend/src/
├── components/features/languages/
│   ├── es.json          # Traducción al español
│   ├── en.json          # Traducción al inglés
│   ├── pt.json          # Traducción al portugués
│   ├── pt_BR.json       # Traducción al portugués brasileño
│   └── ru.json          # Traducción al ruso
├── context/
│   ├── LanguageContextDef.js    # Definición del contexto
│   ├── LanguageContext.jsx      # Proveedor del contexto
│   └── useLanguage.js           # Hook personalizado
├── services/
│   └── languagesService.js      # Servicio API para idiomas
└── ...otros componentes
```

### Backend

- **models**: `UserPreferencesDocument` en `users/documents.py` - Validación de idiomas con choices
- **serializers**: `UserPreferencesSerializer` y `UserPreferencesUpdateSerializer` en `users/serializers.py` - Validación de idiomas
- **API**: `/api/auth/preferences/` - Guardar/recuperar preferencias de idioma en MongoDB

## Características

### 1. **Persistencia**
- Las preferencias se guardan en **localStorage** automáticamente
- Si el usuario está logueado, se sincronizan con **MongoDB** en el backend
- Si no hay usuario logueado, se usa localStorage

### 2. **Sincronización con Preferencias**
- El idioma se conecta automáticamente con el formulario de **SettingsForm.jsx**
- Los cambios de idioma se guardan junto con otras preferencias (tema, estación favorita)
- Las preferencias se cargan al iniciar la aplicación

### 3. **Integración con HamburgerMenu**
- Menú desplegable de idiomas en el navegador
- Cambio dinámico de idioma con un clic
- Indicador visual del idioma actualmente seleccionado

### 4. **Soporte para Usuarios No Autenticados**
- El sistema funciona perfectamente para usuarios sin iniciar sesión
- Usa localStorage para guardar la preferencia localmente
- Cuando el usuario se autentica, se sincroniza con el backend

## Uso

### Para Usar Traducciones en Componentes

```jsx
import { useLanguage } from '../../../context/useLanguage';

function MiComponente() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('settings.title')}</h1>
      <p>{t('common.loading')}</p>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

### Estructura de Traducciones

Las traducciones están organizadas por categorías en archivos JSON:

```json
{
  "common": {
    "loading": "Cargando...",
    "save": "Guardar"
  },
  "hamburger": {
    "userMenu": "Menú de usuario",
    "languages": "Idiomas"
  },
  "settings": {
    "title": "Configuración",
    "language": "Idioma"
  }
}
```

### Acceso a Traducciones

```jsx
const { t } = useLanguage();

// Acceso anidado con notación de punto
t('settings.title')          // "Configuración"
t('hamburger.userMenu')      // "Menú de usuario"
t('common.loading')          // "Cargando..."
```

## Cambio de Idioma

### Desde HamburgerMenu

1. Abre el menú hamburguesa (☰)
2. Selecciona "Idiomas"
3. Haz clic en el idioma deseado
4. El cambio es inmediato

### Desde SettingsForm

1. Ve a Settings
2. Selecciona el idioma en el dropdown "Idioma"
3. Haz clic en "Guardar cambios"
4. El idioma se actualiza y se sincroniza con MongoDB (si autenticado)

### Programáticamente

```jsx
const { setLanguage } = useLanguage();

setLanguage('es');    // Cambiar a español
setLanguage('en');    // Cambiar a inglés
setLanguage('ru');    // Cambiar a ruso
```

## Flujo de Sincronización

```
Inicio de la app
    ↓
1. Buscar idioma en localStorage
2. Si no existe → Intentar cargar de backend (si autenticado)
3. Si no autenticado → Usar idioma del sistema o español por defecto
    ↓
Usuario cambia idioma
    ↓
1. Actualizar en memoria (inmediato)
2. Guardar en localStorage
3. Si autenticado → Sincronizar con MongoDB
    ↓
Interfaz se refresca con nuevas traducciones
```

## API Backend

### GET `/api/auth/preferences/`

Obtiene las preferencias del usuario actual:

```json
{
  "language": "es",
  "theme": "light",
  "favourite_weather_station": null
}
```

### PUT `/api/auth/preferences/`

Actualiza las preferencias del usuario:

```json
{
  "language": "en",
  "theme": "dark",
  "favourite_weather_station": "Madrid"
}
```

## Validación

### Backend
- Validación de idiomas con `choices` en MongoEngine
- Valores permitidos: `['es', 'en', 'pt', 'pt_BR', 'ru']`
- Serializers validan contra esta lista

### Frontend
- Validación en `LanguageContext.jsx`
- Solo permite idiomas registrados en `LANGUAGE_TRANSLATIONS`
- Fallback a español si hay un valor inválido

## Cómo Añadir un Nuevo Idioma

### 1. Crear archivo de traducción

Crea un archivo en `frontend/src/components/features/languages/` con el código del idioma:

```json
// frontend/src/components/features/languages/xx.json
{
  "common": { ... },
  "hamburger": { ... },
  "settings": { ... },
  ...
}
```

### 2. Registrar en LanguageContext

En `frontend/src/context/LanguageContext.jsx`:

```jsx
import xxTranslations from '../components/features/languages/xx.json';

const LANGUAGE_TRANSLATIONS = {
  es: esTranslations,
  en: enTranslations,
  // ... agregar
  xx: xxTranslations,
};
```

### 3. Actualizar Backend

En `backend/users/documents.py`:

```python
class UserPreferencesDocument(EmbeddedDocument):
    language = StringField(max_length=10, default='es', 
                          choices=['es', 'en', 'pt', 'pt_BR', 'ru', 'xx'])
```

En `backend/users/serializers.py`:

```python
def validate_language(self, value):
    allowed_languages = ['es', 'en', 'pt', 'pt_BR', 'ru', 'xx']
    ...
```

### 4. Actualizar HamburgerMenu (Opcional)

Agregar opción en el menú de idiomas en `HamburgerMenu.jsx`:

```jsx
<li>
  <button 
    type="button" 
    onClick={() => {
      setLanguage('xx');
      closeMenu();
    }}
    className={language === 'xx' ? 'active' : ''}
  >
    🇦🇧 {t('hamburger.languageName')}
  </button>
</li>
```

## Manejo de Errores

### Si la traducción no existe

```jsx
const { t } = useLanguage();
t('no.existe')  // Devuelve "no.existe" (la clave misma)
```

### Si falla la carga desde backend

- Se usa el idioma de localStorage como fallback
- Se registra un error en consola
- La aplicación continúa funcionando

## Testing

Para probar el sistema:

1. **Sin autenticación**:
   - Abre la app sin iniciar sesión
   - Cambia idiomas desde HamburgerMenu
   - Recarga la página → El idioma persiste en localStorage

2. **Con autenticación**:
   - Inicia sesión
   - Cambia idioma desde Settings
   - Recarga la página → El idioma se carga desde MongoDB

3. **Sincronización**:
   - Inicia sesión
   - Cambia idioma desde HamburgerMenu
   - Ve a Settings → Verifica que el dropdown muestre el idioma actual

## Casos de Uso

✅ Usuario no autenticado cambia idioma → Persiste en localStorage
✅ Usuario autenticado cambia idioma → Persiste en MongoDB y localStorage
✅ Usuario recarga la página → Se carga el idioma correcto
✅ Usuario se autentica → Se sincroniza el idioma del backend
✅ SettingsForm muestra el idioma actual → Y permite cambiarlo
✅ HamburgerMenu funciona en todos los idiomas → Menú siempre traducido

## Contribuir

Para añadir/actualizar traducciones:

1. Edita el archivo JSON del idioma correspondiente
2. Mantén la estructura de claves consistente
3. Verifica que todas las claves existan en todos los idiomas
4. Prueba que las nuevas traducciones se muestren correctamente
