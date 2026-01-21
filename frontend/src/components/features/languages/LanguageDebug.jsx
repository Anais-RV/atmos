import { useLanguage } from '../../../context/useLanguage';
import './LanguageDebug.css';

/**
 * Componente de debug para verificar que el sistema de idiomas funciona correctamente
 * Muestra el idioma actual y permite cambiar entre idiomas
 * 
 * Uso: Importa este componente en una página para testear
 */

function LanguageDebug() {
  const { language, translations, t, setLanguage } = useLanguage();

  const languages = ['es', 'en', 'pt', 'pt_BR', 'ru'];
  const languageNames = {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    pt_BR: 'Português Brasileiro',
    ru: 'Русский',
  };

  return (
    <div className="language-debug">
      <div className="debug-card">
        <h3>🌐 Language Debug Panel</h3>

        <div className="debug-section">
          <h4>Current Language</h4>
          <p className="current-lang">{language.toUpperCase()}</p>
        </div>

        <div className="debug-section">
          <h4>Change Language</h4>
          <div className="language-buttons">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`lang-btn ${language === lang ? 'active' : ''}`}
                title={languageNames[lang]}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="debug-section">
          <h4>Sample Translations</h4>
          <div className="translations-sample">
            <p>
              <strong>common.loading:</strong> {t('common.loading')}
            </p>
            <p>
              <strong>hamburger.languages:</strong> {t('hamburger.languages')}
            </p>
            <p>
              <strong>settings.title:</strong> {t('settings.title')}
            </p>
            <p>
              <strong>auth.login:</strong> {t('auth.login')}
            </p>
            <p>
              <strong>weather.temperature:</strong> {t('weather.temperature')}
            </p>
          </div>
        </div>

        <div className="debug-section">
          <h4>Storage Info</h4>
          <p>
            <strong>localStorage app_language:</strong>{' '}
            {localStorage.getItem('app_language') || 'Not set'}
          </p>
          <p>
            <strong>Translations loaded:</strong> {Object.keys(translations).length} keys
          </p>
        </div>

        <div className="debug-section">
          <h4>Translation Keys</h4>
          <details>
            <summary>Click to expand</summary>
            <pre>{JSON.stringify(translations, null, 2)}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}

export default LanguageDebug;
