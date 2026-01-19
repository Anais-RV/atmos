const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiClient(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.detail || errorData.message || `Error ${response.status}`
      throw new Error(errorMessage)
    }
    
    return response.json()
  } catch (error) {
    console.error(`API Error [${path}]:`, error.message)
    throw error
  }
}

export default apiClient
