const API_BASE = 'http://localhost:8000/api';

export const preferencesService = {
  /**
   * obtiene las preferencias del usuario autenticado
   * @returns {Promise<Object>} preferencias (language, theme, favorite_station)
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

    // backend may return { success: true, data: { ... } } or raw prefs
    const raw = await response.json();
    const payload = raw && raw.data ? raw.data : raw;

    // normalize favourite_weather_station -> favorite_station for frontend
    return {
      language: payload.language || null,
      theme: payload.theme || null,
      favorite_station: payload.favorite_station ?? payload.favourite_weather_station ?? null,
    };
  },

  /**
   * actualiza las preferencias del usuario
   * @param {Object} preferences - preferencias a actualizar { language, theme, favorite_station }
   * @returns {Promise<Object>} preferencias actualizadas
   */
  updatePreferences: async (preferences) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // map frontend favorite_station -> backend favourite_weather_station
    const body = { ...preferences };
    if (body.favorite_station !== undefined) {
      body.favourite_weather_station = body.favorite_station;
      delete body.favorite_station;
    }

    const response = await fetch(`${API_BASE}/auth/preferences/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error updating preferences: ${response.statusText}`);
    }

    // normalize response similar to getPreferences
    const raw = await response.json();
    const payload = raw && raw.data ? raw.data : raw;

    return {
      language: payload.language || null,
      theme: payload.theme || null,
      favorite_station: payload.favorite_station ?? payload.favourite_weather_station ?? null,
    };
  },
};

export default preferencesService;
