/**
 * Servicio para gestionar etiquetas del usuario
 * Realiza llamadas a los endpoints del backend
 */

const API_BASE = 'http://localhost:8000/api/auth'

export const tagsService = {
  /**
   * Obtener todas las etiquetas del usuario
   */
  async getTags() {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${API_BASE}/tags/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        }
        throw new Error(`Error al obtener etiquetas: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error en getTags:', error)
      throw error
    }
  },

  /**
   * Crear una nueva etiqueta
   */
  async createTag(name, color) {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${API_BASE}/tags/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        }
        const data = await response.json()
        throw new Error(data.name?.[0] || `Error al crear etiqueta: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error en createTag:', error)
      throw error
    }
  },

  /**
   * Actualizar una etiqueta existente
   */
  async updateTag(id, name, color) {
    try {
      const response = await fetch(`${API_BASE}/tags/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.name?.[0] || `Error al actualizar etiqueta: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error en updateTag:', error)
      throw error
    }
  },

  /**
   * Eliminar una etiqueta
   */
  async deleteTag(id) {
    try {
      const response = await fetch(`${API_BASE}/tags/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (!response.ok && response.status !== 204) {
        throw new Error(`Error al eliminar etiqueta: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error en deleteTag:', error)
      throw error
    }
  },
}
