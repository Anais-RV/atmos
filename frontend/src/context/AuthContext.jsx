import { createContext, useContext, useEffect, useState } from 'react'
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
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user || null)
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

export function useAuth() {
  return useContext(AuthContext)
}
