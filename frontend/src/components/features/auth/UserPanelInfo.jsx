import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

function UserPanelInfo() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="auth-user-panel auth-user-panel-guest">
        <div className="auth-user-header">
          <div className="auth-user-avatar guest">I</div>
          <div>
            <h2 className="auth-user-name">Invitado</h2>
          </div>
        </div>

        <div className="auth-user-actions">
          <button
            className="auth-button-primary"
            onClick={() => navigate('/login')}
          >
            Inicia sesión
          </button>
        </div>
      </div>
    )
  }

  const displayUser = {
    name: user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.username || 'Invitado',
    email: user?.email || null,
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="auth-user-panel">
      <div className="auth-user-header">
        <div className="auth-user-avatar">
          {displayUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="auth-user-name">{displayUser.name}</h2>
          {displayUser.email && (
            <p className="auth-user-email">{displayUser.email}</p>
          )}
        </div>
      </div>

      <div className="auth-user-actions">
        <button
          className="auth-button-secondary"
          onClick={() => navigate('/tags')}
        >
          Mis etiquetas
        </button>

        {user && (
          <button
            className="auth-button-secondary"
            onClick={handleLogout}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  )
}

export default UserPanelInfo
