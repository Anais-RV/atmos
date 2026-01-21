/**
 * EJEMPLOS DE USO - SISTEMA DE IDIOMAS
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar el sistema de idiomas
 * en diferentes componentes.
 */

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 1: COMPONENTE SIMPLE CON TRADUCCIONES
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useLanguage } from '../context/useLanguage';

function WelcomePage() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.noData')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 2: CAMBIAR IDIOMA DESDE UN COMPONENTE
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useLanguage } from '../context/useLanguage';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'pt_BR', name: 'Português Brasileiro' },
    { code: 'ru', name: 'Русский' },
  ];

  return (
    <div>
      <p>Idioma actual: {language}</p>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          style={{
            fontWeight: language === lang.code ? 'bold' : 'normal',
          }}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 3: COMPONENTE CON CONDICIONES TRADUCIDAS
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useLanguage } from '../context/useLanguage';
import { useAuth } from '../context/useAuth';

function UserStatus() {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        <p>{t('common.welcome')}, {user.username}!</p>
        <button>{t('common.logout')}</button>
      </div>
    );
  }

  return (
    <div>
      <p>{t('auth.login')}</p>
      <button>{t('auth.register')}</button>
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 4: LISTA TRADUCIDA
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useLanguage } from '../context/useLanguage';

function WeatherInfo({ weatherData }) {
  const { t } = useLanguage();

  return (
    <ul>
      <li>
        {t('weather.temperature')}: {weatherData.temp}°C
      </li>
      <li>
        {t('weather.humidity')}: {weatherData.humidity}%
      </li>
      <li>
        {t('weather.windSpeed')}: {weatherData.windSpeed} km/h
      </li>
      <li>
        {t('weather.rainfall')}: {weatherData.rainfall} mm
      </li>
    </ul>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 5: FORMULARIO CON VALIDACIÓN TRADUCIDA
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useState } from 'react';
import { useLanguage } from '../context/useLanguage';

function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('common.error') + ': ' + t('auth.email') + ' y ' + t('auth.password') + ' requeridos');
      return;
    }
    // Enviar formulario...
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t('auth.email')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email')}
        />
      </div>
      <div>
        <label>{t('auth.password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">{t('auth.login')}</button>
      <p>
        {t('auth.forgotPassword')}? <a href="/password-reset">{t('auth.reset')}</a>
      </p>
    </form>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 6: COMPONENTE CON ACCESO A TODAS LAS CARACTERÍSTICAS
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useLanguage } from '../context/useLanguage';

function LanguagePanel() {
  // Desestructurar todas las características disponibles
  const { 
    language,           // Idioma actual (string: 'es', 'en', etc.)
    translations,       // Objeto con todas las traducciones
    setLanguage,        // Función para cambiar idioma
    t,                  // Función para obtener traducción
  } = useLanguage();

  return (
    <div>
      <h2>{t('hamburger.languages')}</h2>
      <p>Idioma actual: {language}</p>
      
      <h3>Debug - Primeras 5 claves:</h3>
      <pre>
        {JSON.stringify(
          Object.keys(translations).slice(0, 5),
          null,
          2
        )}
      </pre>
      
      <h3>Cambiar idioma:</h3>
      <button onClick={() => setLanguage('es')}>Español</button>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('pt')}>Português</button>
      <button onClick={() => setLanguage('pt_BR')}>Português Brasileiro</button>
      <button onClick={() => setLanguage('ru')}>Русский</button>
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 7: HOOK CUSTOMIZADO BASADO EN useLanguage
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useLanguage } from '../context/useLanguage';

// Hook personalizado para traduciones de errores
export function useErrorMessages() {
  const { t } = useLanguage();

  return {
    emailRequired: t('auth.email') + ' requerido',
    passwordRequired: t('auth.password') + ' requerido',
    passwordMismatch: 'Las contraseñas no coinciden',
    networkError: 'Error de conexión',
    serverError: 'Error del servidor',
    unauthorized: 'No autorizado',
    forbidden: 'Acceso denegado',
  };
}

// Uso en componente
function LoginForm() {
  const errors = useErrorMessages();
  // ... usar errors.emailRequired, errors.passwordRequired, etc.
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 8: COMPONENTE CON LOADING Y TRADUCCIONES
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/useLanguage';

function DataFetcher() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('API Error');
        setData(await response.json());
        setError(null);
      } catch (err) {
        setError(t('common.error'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) return <p>{t('common.loading')}</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data) return <p>{t('dashboard.noData')}</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE CLAVES DISPONIBLES
// ═══════════════════════════════════════════════════════════════════════════

/*
CATEGORÍAS PRINCIPALES:

common.*
  ├─ loading           "Cargando..."
  ├─ error             "Error"
  ├─ success           "Éxito"
  ├─ save              "Guardar"
  ├─ cancel            "Cancelar"
  ├─ delete            "Eliminar"
  ├─ edit              "Editar"
  ├─ close             "Cerrar"
  ├─ back              "Atrás"
  ├─ next              "Siguiente"
  ├─ submit            "Enviar"
  └─ logout            "Cerrar sesión"

navigation.*
  ├─ menu              "Menú"
  ├─ dashboard         "Panel de control"
  ├─ userPanel         "Panel de usuario"
  ├─ settings          "Configuración"
  ├─ tags              "Etiquetas"
  ├─ forecast          "Pronóstico"
  ├─ history           "Historial"
  └─ charts            "Gráficos"

hamburger.*
  ├─ userMenu          "Menú de usuario"
  ├─ viewPanel         "Ver tu panel y preferencias"
  ├─ darkMode          "Modo oscuro"
  ├─ lightMode         "Modo claro"
  ├─ themeSub          "Ajustar tema de la interfaz"
  ├─ languages         "Idiomas"
  ├─ changeLanguage    "Cambiar idioma de la app"
  ├─ accessibility     "Accesibilidad"
  ├─ disabilitySettings "Ajustes de discapacidad"
  ├─ visualDisability  "Discapacidad visual"
  ├─ subtitles         "Subtitulado ST"
  ├─ deafBlind         "Sordo-ciego"
  ├─ spanish           "Español"
  ├─ english           "Inglés"
  ├─ portuguese        "Portugués"
  ├─ russian           "Ruso"
  └─ brazilianPortuguese "Portugués Brasileño"

settings.*
  ├─ title             "Configuración"
  ├─ language          "Idioma"
  ├─ selectLanguage    "Selecciona tu idioma preferido"
  ├─ appearance        "Apariencia"
  ├─ themeMode         "Modo de tema"
  ├─ light             "Claro"
  ├─ dark              "Oscuro"
  ├─ auto              "Automático"
  ├─ autoHelpText      "El modo automático usa la preferencia de tu sistema"
  ├─ favoriteStation   "Estación Meteorológica Favorita"
  ├─ selectStation     "Selecciona tu estación meteorológica preferida"
  ├─ stationHelpText   "Se mostrará como tu estación predeterminada en el dashboard"
  ├─ noSelection       "Sin seleccionar"
  ├─ saveChanges       "Guardar cambios"
  ├─ saving            "Guardando..."
  ├─ successMessage    "✓ Preferencias guardadas exitosamente"
  ├─ errorSaving       "Error al guardar las preferencias"
  └─ loadingPreferences "Cargando preferencias..."

auth.*
  ├─ login             "Iniciar sesión"
  ├─ register          "Registrarse"
  ├─ email             "Correo electrónico"
  ├─ password          "Contraseña"
  ├─ passwordConfirm   "Confirmar contraseña"
  ├─ username          "Nombre de usuario"
  ├─ loginSuccess      "Sesión iniciada correctamente"
  ├─ registerSuccess   "Registro completado correctamente"
  └─ forgotPassword    "¿Olvidaste tu contraseña?"

weather.*
  ├─ temperature       "Temperatura"
  ├─ humidity          "Humedad"
  ├─ windSpeed         "Velocidad del viento"
  ├─ rainfall          "Precipitación"
  ├─ forecast          "Pronóstico"
  ├─ today             "Hoy"
  ├─ tomorrow          "Mañana"
  └─ nextDays          "Próximos días"

dashboard.*
  ├─ title             "Panel de control"
  ├─ welcome           "Bienvenido"
  ├─ noData            "No hay datos disponibles"
  └─ selectCity        "Selecciona una ciudad"
*/

export { /* Ejemplos de código */ };
