import { useState, useEffect } from 'react';
import { usePreferences } from '../../../context/usePreferences';
import { useLanguage } from '../../../context/useLanguage';
import PropTypes from 'prop-types';

function SettingsForm({ cities = [] }) {
  const { preferences, loading, error, updatePreferences } = usePreferences();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    language: 'es',
    theme: 'light',
    favorite_station: null,
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar formulario con preferencias del contexto
  useEffect(() => {
    if (preferences) {
      setFormData({
        language: preferences.language || 'es',
        theme: preferences.theme || 'light',
        favorite_station: preferences.favorite_station || null,
      });
    }
  }, [preferences]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsSubmitting(true);

    try {
      await updatePreferences(formData);
      setIsError(false);
      setMessage(t('settings.successMessage'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setIsError(true);
      setMessage(err.message || t('settings.errorSaving'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !preferences.language) {
    return <div className="settings-loading">{t('settings.loadingPreferences')}</div>;
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      {error && <div className="settings-error">{error}</div>}

      {/* Sección: Idioma */}
      <div className="settings-section">
        <h3 className="settings-section-title">{t('settings.language')}</h3>
        <div className="settings-field">
          <label htmlFor="language" className="settings-label">
            {t('settings.selectLanguage')}
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="settings-input settings-select"
          >
            <option value="es">{t('hamburger.spanish')}</option>
            <option value="en">{t('hamburger.english')}</option>
            <option value="pt">{t('hamburger.portuguese')}</option>
            <option value="pt_BR">{t('hamburger.brazilianPortuguese')}</option>
            <option value="ru">{t('hamburger.russian')}</option>
            <option value="fr">{t('hamburger.french')}</option>
          </select>
        </div>
      </div>

      {/* Sección: Tema */}
      <div className="settings-section">
        <h3 className="settings-section-title">{t('settings.appearance')}</h3>
        <div className="settings-field">
          <label htmlFor="theme" className="settings-label">
            {t('settings.themeMode')}
          </label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="settings-input settings-select"
          >
            <option value="light">{t('settings.light')}</option>
            <option value="dark">{t('settings.dark')}</option>
            <option value="auto">{t('settings.auto')}</option>
          </select>
          <p className="settings-help-text">
            {t('settings.autoHelpText')}
          </p>
        </div>
      </div>

      {/* Sección: Estación Meteorológica Favorita */}
      {cities && cities.length > 0 && (
        <div className="settings-section">
          <h3 className="settings-section-title">{t('settings.favoriteStation')}</h3>
          <div className="settings-field">
            <label htmlFor="favorite_station" className="settings-label">
              {t('settings.selectStation')}
            </label>
            <select
              id="favorite_station"
              name="favorite_station"
              value={formData.favorite_station || ''}
              onChange={handleChange}
              className="settings-input settings-select"
            >
              <option value="">{t('settings.noSelection')}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <p className="settings-help-text">
              {t('settings.stationHelpText')}
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de estado */}
      {message && (
        <div className={`settings-message ${isError ? 'settings-message-error' : 'settings-message-success'}`}>
          {message}
        </div>
      )}

      {/* Botones */}
      <div className="settings-actions">
        <button
          type="submit"
          className="settings-button settings-button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('settings.saving') : t('settings.saveChanges')}
        </button>
      </div>
    </form>
  );
}

SettingsForm.propTypes = {
  cities: PropTypes.array,
};

export default SettingsForm;
