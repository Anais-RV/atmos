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

    return await response.json();
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

    return await response.json();
  },
};

export default preferencesService;
