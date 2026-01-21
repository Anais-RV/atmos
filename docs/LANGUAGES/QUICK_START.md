```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    🌐 SISTEMA DE IDIOMAS - INICIO RÁPIDO                   ║
║                                                                              ║
║                  Guía de 5 minutos para empezar a usar                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌──────────────────────────────────────────────────────────────────────────────┐
│ 1️⃣  PROBAR EL SISTEMA (Sin escribir código)                                 │
└──────────────────────────────────────────────────────────────────────────────┘

a) Abre la app:
   → http://localhost:3000

b) Haz clic en el menú hamburguesa (☰)
   
c) Selecciona "Idiomas"
   
d) Elige un idioma:
   🇪🇸 Español
   🇺🇸 English
   🇵🇹 Português
   🇧🇷 Português Brasileiro
   🇷🇺 Русский

e) ✅ Verifica que TODA la interfaz cambió de idioma

f) Recarga la página (F5)
   → ✅ El idioma debe persistir


┌──────────────────────────────────────────────────────────────────────────────┐
│ 2️⃣  USAR EN TUS COMPONENTES (Código básico)                                 │
└──────────────────────────────────────────────────────────────────────────────┘

Paso 1: Importar el hook
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    import { useLanguage } from '../context/useLanguage';


Paso 2: Usar en tu componente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function MiComponente() {
      const { t } = useLanguage();
      
      return <h1>{t('common.loading')}</h1>;
    }


Paso 3: Cambiar idioma (opcional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function MiComponente() {
      const { t, setLanguage } = useLanguage();
      
      return (
        <div>
          <h1>{t('common.loading')}</h1>
          <button onClick={() => setLanguage('en')}>
            Cambiar a English
          </button>
        </div>
      );
    }


┌──────────────────────────────────────────────────────────────────────────────┐
│ 3️⃣  CLAVES DISPONIBLES (Más comunes)                                       │
└──────────────────────────────────────────────────────────────────────────────┘

GENERALES:
  t('common.loading')    → "Cargando..."
  t('common.error')      → "Error"
  t('common.success')    → "Éxito"
  t('common.save')       → "Guardar"
  t('common.logout')     → "Cerrar sesión"

MENÚ:
  t('hamburger.userMenu')          → "Menú de usuario"
  t('hamburger.languages')         → "Idiomas"
  t('hamburger.spanish')           → "Español"
  t('hamburger.english')           → "English"
  t('hamburger.brazilianPortuguese') → "Português Brasileiro"

CONFIGURACIÓN:
  t('settings.title')      → "Configuración"
  t('settings.language')   → "Idioma"
  t('settings.appearance') → "Apariencia"
  t('settings.saveChanges') → "Guardar cambios"

CLIMA:
  t('weather.temperature')  → "Temperatura"
  t('weather.humidity')     → "Humedad"
  t('weather.windSpeed')    → "Velocidad del viento"


┌──────────────────────────────────────────────────────────────────────────────┐
│ 4️⃣  ESTRUCTURA DE CARPETAS                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

frontend/src/
├── context/
│   ├── LanguageContext.jsx      ← Proveedor (Provider)
│   ├── LanguageContextDef.js    ← Definición
│   └── useLanguage.js           ← Hook a usar
│
├── components/features/languages/
│   ├── es.json                  ← Traducciones
│   ├── en.json
│   ├── pt.json
│   ├── pt_BR.json
│   ├── ru.json
│   ├── LanguageDebug.jsx        ← Para testing
│   └── README.md                ← Documentación
│
└── services/
    └── languagesService.js      ← Comunicación con API


┌──────────────────────────────────────────────────────────────────────────────┐
│ 5️⃣  CASOS DE USO COMUNES                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

CASO 1: Título traducido
────────────────────────
  function MiPágina() {
    const { t } = useLanguage();
    return <h1>{t('dashboard.title')}</h1>;
  }


CASO 2: Error traducido
─────────────────────────
  function Formulario() {
    const { t } = useLanguage();
    const [error, setError] = useState('');
    
    return (
      <>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <button onClick={() => setError(t('common.error'))}>
          Mostrar Error
        </button>
      </>
    );
  }


CASO 3: Múltiples textos
────────────────────────
  function Card() {
    const { t } = useLanguage();
    return (
      <div>
        <h2>{t('weather.temperature')}</h2>
        <p>{t('weather.humidity')}</p>
        <button>{t('common.save')}</button>
      </div>
    );
  }


CASO 4: Con variables
──────────────────────
  function Saludo({ nombre }) {
    const { t } = useLanguage();
    return <p>{t('dashboard.welcome')}, {nombre}!</p>;
  }


┌──────────────────────────────────────────────────────────────────────────────┐
│ 6️⃣  VERIFICAR QUE TODO FUNCIONA                                            │
└──────────────────────────────────────────────────────────────────────────────┘

Test 1: HamburgerMenu ✅
  → Abre http://localhost:3000
  → Haz clic en ☰
  → Selecciona "Idiomas"
  → Elige un idioma
  → Recarga página
  → ✅ Debe persistir

Test 2: Settings ✅
  → Inicia sesión
  → Ve a /settings
  → Cambia el idioma
  → Haz clic "Guardar cambios"
  → Recarga página
  → ✅ Debe estar en MongoDB

Test 3: Debug ✅ (Para desarrolladores)
  → Importa: import LanguageDebug from '../components/features/languages/LanguageDebug'
  → Usa: <LanguageDebug />
  → Verifica panel interactivo


┌──────────────────────────────────────────────────────────────────────────────┐
│ 7️⃣  ERRORES COMUNES Y SOLUCIONES                                           │
└──────────────────────────────────────────────────────────────────────────────┘

❌ Error: "useLanguage debe usarse dentro de un LanguageProvider"
✅ Solución: Verifica que App.jsx envuelve el componente con <LanguageProvider>

❌ Error: "t is not defined"
✅ Solución: Importa: const { t } = useLanguage();

❌ Error: Traducciones muestran "no.existe"
✅ Solución: Verifica que la clave existe en es.json

❌ Error: Cambios de idioma no persisten
✅ Solución: 
   - Sin login: Habilita localStorage en navegador
   - Con login: Verifica conexión con backend


┌──────────────────────────────────────────────────────────────────────────────┐
│ 8️⃣  DOCUMENTACIÓN DISPONIBLE                                               │
└──────────────────────────────────────────────────────────────────────────────┘

Para aprender más:

1. LANGUAGES_SUMMARY.md
   → Resumen completo (2 minutos de lectura)

2. LANGUAGE_QUICK_REFERENCE.md
   → Referencia rápida (1 minuto)

3. LANGUAGE_INTEGRATION_GUIDE.md
   → Cómo traducir más componentes (10 minutos)

4. LANGUAGE_EXAMPLES.js
   → 8+ ejemplos de código práctico

5. frontend/src/components/features/languages/README.md
   → Documentación técnica detallada


┌──────────────────────────────────────────────────────────────────────────────┐
│ 9️⃣  IDIOMAS Y SUS CÓDIGOS                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

Usar en setLanguage():

  setLanguage('es')       🇪🇸 Español
  setLanguage('en')       🇺🇸 English
  setLanguage('pt')       🇵🇹 Português
  setLanguage('pt_BR')    🇧🇷 Português Brasileiro
  setLanguage('ru')       🇷🇺 Русский


┌──────────────────────────────────────────────────────────────────────────────┐
│ 🔟 CHECKLIST FINAL                                                         │
└──────────────────────────────────────────────────────────────────────────────┘

Para verificar que todo está funcionando:

☐ El HamburgerMenu muestra opciones de idioma
☐ Puedo cambiar idioma desde HamburgerMenu
☐ La interfaz cambia de idioma inmediatamente
☐ El cambio persiste después de recargar
☐ En Settings puedo cambiar idioma también
☐ Los cambios desde Settings se guardan en MongoDB
☐ Sin autenticación, los cambios persisten en localStorage
☐ Los componentes podem usar useLanguage() hook
☐ Las traducciones se muestran correctamente

✅ Si todos los items están marcados → Sistema funcionando perfectamente


═══════════════════════════════════════════════════════════════════════════════

¡LISTO PARA EMPEZAR! 🚀

Próximos pasos:
1. Prueba cambiando de idioma
2. Usa useLanguage() en tus componentes
3. Consulta la documentación para casos avanzados

═══════════════════════════════════════════════════════════════════════════════
```