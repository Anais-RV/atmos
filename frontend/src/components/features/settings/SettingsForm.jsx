import { useState, useEffect } from 'react';
import { usePreferences } from '../../../context/usePreferences';
import PropTypes from 'prop-types';

function SettingsForm({ cities = [] }) {
  const { preferences, loading, error, updatePreferences } = usePreferences();

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
      setMessage('✓ Preferencias guardadas exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Error al guardar las preferencias');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !preferences.language) {
    return <div className="settings-loading">Cargando preferencias...</div>;
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      {error && <div className="settings-error">{error}</div>}

      {/* Sección: Idioma */}
      <div className="settings-section">
        <h3 className="settings-section-title">Idioma</h3>
        <div className="settings-field">
          <label htmlFor="language" className="settings-label">
            Selecciona tu idioma preferido
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="settings-input settings-select"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* Sección: Tema */}
      <div className="settings-section">
        <h3 className="settings-section-title">Apariencia</h3>
        <div className="settings-field">
          <label htmlFor="theme" className="settings-label">
            Modo de tema
          </label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="settings-input settings-select"
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
            <option value="auto">Automático</option>
          </select>
          <p className="settings-help-text">
            El modo automático usa la preferencia de tu sistema
          </p>
        </div>
      </div>

      {/* Sección: Estación Meteorológica Favorita */}
      {cities && cities.length > 0 && (
        <div className="settings-section">
          <h3 className="settings-section-title">Estación Meteorológica Favorita</h3>
          <div className="settings-field">
            <label htmlFor="favorite_station" className="settings-label">
              Selecciona tu estación meteorológica preferida
            </label>
            <select
              id="favorite_station"
              name="favorite_station"
              value={formData.favorite_station || ''}
              onChange={handleChange}
              className="settings-input settings-select"
            >
              <option value="">Sin seleccionar</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <p className="settings-help-text">
              Se mostrará como tu estación predeterminada en el dashboard
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
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}

SettingsForm.propTypes = {
  cities: PropTypes.array,
};

export default SettingsForm;
