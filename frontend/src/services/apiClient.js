const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiClient(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}`)
  }
  
  return response.json()
}

export default apiClient
