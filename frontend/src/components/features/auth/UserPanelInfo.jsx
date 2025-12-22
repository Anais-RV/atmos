import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

function UserPanelInfo() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const displayUser = {
    name: user?.first_name && user?.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user?.username || 'Invitado',
    email: user?.email || 'No disponible',
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
          <p className="auth-user-email">{displayUser.email}</p>
        </div>
      </div>

      <div className="auth-user-actions">
        <button
          className="auth-button-secondary"
          onClick={handleLogout}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default UserPanelInfo
