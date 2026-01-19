/**
 * Servicio de autenticación
 * Gestiona login, registro y manejo de tokens JWT
 */

const API_BASE = '/api/auth';

export const authService = {
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Tokens y datos del usuario
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en el login');
      }

      const data = await response.json();
      
      // El backend devuelve los tokens dentro de data.tokens
      const accessToken = data.tokens?.access || data.access;
      const refreshToken = data.tokens?.refresh || data.refresh;
      
      // Guardar tokens en localStorage
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} email - Email
   * @param {string} password - Contraseña
   * @param {string} password2 - Confirmación de contraseña
   * @returns {Promise<Object>} - Usuario creado
   */
  async register(username, email, password, password2) {
    try {
      const response = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password2 }),
      });

      if (!response.ok) {
        const error = await response.json();
        // Extraer mensaje de error más específico
        const errorMessage = error.email?.[0] || error.username?.[0] || error.password?.[0] || error.error || 'Error en el registro';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  /**
   * Logout - Elimina tokens
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Verificar si hay usuario autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Obtener token de acceso
   * @returns {string|null}
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }
};

export default authService;
