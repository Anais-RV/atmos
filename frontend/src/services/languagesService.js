const API_BASE = 'http://localhost:8000/api';

export const languagesService = {
  /**
   * Obtiene las preferencias del usuario autenticado (incluye idioma)
   * @returns {Promise<Object>} preferencias con idioma
   */
  getPreferences: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE}/auth/preferences/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching preferences: ${response.statusText}`);
    }

    const raw = await response.json();
    const payload = raw && raw.data ? raw.data : raw;

    return {
      language: payload.language || 'es',
      theme: payload.theme || 'light',
      favorite_station: payload.favorite_station ?? payload.favourite_weather_station ?? null,
    };
  },

  /**
   * Actualiza el idioma del usuario
   * @param {Object} preferences - preferencias a actualizar { language }
   * @returns {Promise<Object>} preferencias actualizadas
   */
  updatePreferences: async (preferences) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE}/auth/preferences/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error updating preferences: ${response.statusText}`);
    }

    const raw = await response.json();
    const payload = raw && raw.data ? raw.data : raw;

    return {
      language: payload.language || 'es',
      theme: payload.theme || 'light',
      favorite_station: payload.favorite_station ?? payload.favourite_weather_station ?? null,
    };
  },

  /**
   * Obtiene los idiomas disponibles
   * @returns {Promise<Array>} lista de idiomas disponibles
   */
  getAvailableLanguages: async () => {
    return [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'pt_BR', name: 'Português Brasileiro', flag: '🇧🇷' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    ];
  },
};

export default languagesService;
