# 🌐 GUÍA DE REFERENCIA RÁPIDA - SISTEMA DE IDIOMAS

## ⚡ Iniciar Rápidamente

### Usar en un Componente
```jsx
import { useLanguage } from '../context/useLanguage';

function MiComponente() {
  const { t } = useLanguage();
  return <h1>{t('settings.title')}</h1>;
}
```

### Cambiar Idioma
```jsx
const { setLanguage } = useLanguage();
setLanguage('en');  // Cambiar a inglés
```

---

## 📚 Categorías de Traducciones

### `common.*`
`loading` | `error` | `success` | `save` | `cancel` | `delete` | `edit` | `close` | `back` | `next` | `submit` | `logout`

### `hamburger.*`
`userMenu` | `darkMode` | `lightMode` | `languages` | `spanish` | `english` | `portuguese` | `russian` | `brazilianPortuguese` | `accessibility` | `visualDisability` | `subtitles` | `deafBlind`

### `settings.*`
`title` | `language` | `selectLanguage` | `appearance` | `themeMode` | `light` | `dark` | `auto` | `favoriteStation` | `selectStation` | `noSelection` | `saveChanges` | `saving` | `successMessage` | `errorSaving` | `loadingPreferences`

### `auth.*`
`login` | `register` | `email` | `password` | `passwordConfirm` | `username` | `loginSuccess` | `registerSuccess` | `forgotPassword`

### `weather.*`
`temperature` | `humidity` | `windSpeed` | `rainfall` | `forecast` | `today` | `tomorrow` | `nextDays`

### `dashboard.*`
`title` | `welcome` | `noData` | `selectCity`

---

## 🔧 Idiomas Disponibles

| Código | Nombre | Bandera |
|--------|--------|---------|
| `es` | Español | 🇪🇸 |
| `en` | English | 🇺🇸 |
| `pt` | Português | 🇵🇹 |
| `pt_BR` | Português Brasileiro | 🇧🇷 |
| `ru` | Русский | 🇷🇺 |

---

## 📍 Archivos Clave

```
context/
├── LanguageContext.jsx       ← Proveedor
├── LanguageContextDef.js     ← Definición
└── useLanguage.js            ← Hook

components/features/languages/
├── es.json, en.json, ...     ← Traducciones
├── LanguageDebug.jsx         ← Para testing
└── README.md                 ← Documentación

services/
└── languagesService.js       ← API
```

---

## 🎯 Casos de Uso Comunes

### Mostrar Texto Traducido
```jsx
const { t } = useLanguage();
return <p>{t('common.loading')}</p>;
```

### Menú de Idiomas
```jsx
const { setLanguage, language } = useLanguage();
return (
  <select value={language} onChange={e => setLanguage(e.target.value)}>
    <option value="es">Español</option>
    <option value="en">English</option>
    {/* ... más idiomas */}
  </select>
);
```

### Condicional Traducido
```jsx
const { t } = useLanguage();
if (isLoading) return <p>{t('common.loading')}</p>;
return <p>{t('dashboard.welcome')}</p>;
```

---

## ⚠️ Errores Comunes

### Error: "useLanguage debe usarse dentro de un LanguageProvider"
**Solución:** Verifica que `<LanguageProvider>` envuelva el componente en App.jsx

### La traducción devuelve la clave en lugar del valor
**Solución:** Verifica que la clave existe exactamente igual en el JSON

### Cambios de idioma no persisten
**Solución:**
- Sin auth: Verifica localStorage está habilitado
- Con auth: Verifica el token y la conexión con backend

---

## 🧪 Debugging

### Ver idioma actual
```javascript
localStorage.getItem('app_language')
```

### Ver todas las traducciones
```jsx
const { translations } = useLanguage();
console.log(translations);
```

### Usar componente de debug
```jsx
import LanguageDebug from '../components/features/languages/LanguageDebug';
// En JSX: <LanguageDebug />
```

---

## 📱 Flujo de Usuario

```
1. Usuario abre app
   ↓
2. LanguageProvider detecta idioma
   (localStorage → backend → sistema → español)
   ↓
3. Interfaz carga con idioma correcto
   ↓
4. Usuario cambia idioma (HamburgerMenu o Settings)
   ↓
5. Se guarda en localStorage (inmediato)
   ↓
6. Si autenticado: se sincroniza con MongoDB
   ↓
7. Interfaz se actualiza (sin recargar)
```

---

## 🔗 Enlaces Útiles

- 📖 [Guía Completa](LANGUAGES_IMPLEMENTATION.md)
- 📚 [Documentación Detallada](frontend/src/components/features/languages/README.md)
- 💻 [Ejemplos de Código](LANGUAGE_EXAMPLES.js)
- ✅ [Checklist de Verificación](LANGUAGES_VERIFICATION.js)

---

## 💡 Tips

- ✅ Usa `t()` para todas las cadenas de texto visible al usuario
- ✅ Importa `useLanguage` en componentes que muestren texto dinámico
- ✅ Agrega nuevas traducciones a los 5 archivos JSON
- ✅ Usa `LanguageDebug` durante desarrollo
- ✅ Valida con `validate-translations.js` después de cambios

---

## 🚀 Soporte Rápido

**¿Cómo agregar una nueva traducción?**
1. Abre el archivo JSON del idioma (ej: es.json)
2. Agrega la clave bajo la categoría apropiada
3. Repite para los 5 idiomas (mantén la misma estructura)
4. Corre: `node validate-translations.js`
5. Usa `t('categoria.nuevaClave')` en tu componente

**¿Cómo traducir un nuevo componente?**
1. Importa `useLanguage`: `const { t } = useLanguage()`
2. Reemplaza todas las cadenas: `<p>{t('categoria.clave')}</p>`
3. Verifica que las claves existan en todos los JSONs
4. Prueba cambiando de idioma

**¿Cómo agregar un nuevo idioma?**
1. Ver documentación en `frontend/src/components/features/languages/README.md`
2. Crear nuevo archivo: `frontend/src/components/features/languages/xx.json`
3. Copiar estructura de es.json
4. Traducir todas las claves
5. Registrar en `LanguageContext.jsx`
6. Actualizar backend: `documents.py` y `serializers.py`

---

## 📞 Contacto & Soporte

Para problemas:
1. Consulta los documentos (README.md, IMPLEMENTATION.md)
2. Usa `LanguageDebug` para diagnosticar
3. Revisa la consola del navegador
4. Verifica los logs del backend

---

**Última actualización:** 2025-01-21  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para producción
