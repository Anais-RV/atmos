import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import authService from '../services/authService'
import apiClient from '../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const access = authService.getAccessToken()
    if (!access) {
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const resp = await apiClient('/api/auth/me/', {
          headers: { Authorization: `Bearer ${access}` },
        })
        setUser(resp)
      } catch (error) {
        console.error('Error fetching user data:', error.message)
        setUser(null)
        // Si el token es inválido, limpiarlo
        if (error.message.includes('auth') || error.message.includes('401') || error.message.includes('403')) {
          authService.logout()
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    
    // Obtener datos del usuario después del login
    try {
      const access = authService.getAccessToken()
      if (access) {
        const resp = await apiClient('/api/auth/me/', {
          headers: { Authorization: `Bearer ${access}` },
        })
        setUser(resp)
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error)
      setUser(null)
    }
    
    return data
  }

  const logout = async () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  return useContext(AuthContext)
}
