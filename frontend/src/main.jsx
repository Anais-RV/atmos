import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

// Silenciar promesas rechazadas no capturadas de librerías externas
window.addEventListener('unhandledrejection', event => {
  // Solo permitir que se muestre el error si es crítico
  if (event.reason?.message?.includes('auth required')) {
    // Ignorar errores de "auth required" ya que son manejados
    event.preventDefault()
    console.debug('Auth error silenced:', event.reason)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />    {/* <-- ESTO ES children */}
    </AuthProvider>
  </React.StrictMode>
)