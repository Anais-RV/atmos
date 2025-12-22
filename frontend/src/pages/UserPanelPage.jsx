/**
 * Página: UserPanelPage
 * Propósito: Panel de usuario autenticado con información del perfil y accesos rápidos.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - UserPanelInfo (información detallada del usuario: nombre, email, acciones)
 *  - TagManager (gestión de etiquetas personalizadas del usuario)
 * Feature/dominio: auth
 * Tipo: Página de panel (dashboard de usuario con botones de acción)
 */

// frontend/src/pages/UserPanelPage.jsx

import { useNavigate } from "react-router-dom";
import BasePageLayout from "../components/layout/BasePageLayout";
import UserPanelInfo from "../components/features/auth/UserPanelInfo";
import TagManager from "../components/features/auth/TagManager";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useAuth } from '../context/AuthContext'

function UserPanelPage() {
  const navigate = useNavigate();
  // Si quieres que sea igual que el Login/Dashboard, usa también 7
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  const { user } = useAuth()
  const userName = user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || null

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <section className="auth-card auth-login-card">
        <div className="auth-login-inner">
          {/* Avatar del usuario */}
          <div className="auth-login-avatar">
            <span className="auth-login-avatar-initial">
              {(userName ? userName.charAt(0) : 'I').toUpperCase()}
            </span>
          </div>

          {/* Contenido del panel de usuario */}
          <div className="auth-login-content">
            <header className="auth-card-header">
              <h1 className="auth-card-title">{user ? `Bienvenido, ${userName}` : 'Bienvenido'}</h1>
              <p className="auth-card-subtitle">
                Gestiona tu perfil y tus ajustes personales de ATMOS.
              </p>
            </header>

            {/* Bloque azul con botones tipo "Sign in" */}
            <div className="user-panel-actions-card">
              <p className="user-panel-actions-text">
                Accede rápidamente a las secciones más importantes de tu panel:
              </p>
              <div className="user-panel-actions-buttons">
                <button type="button" className="auth-button-primary" onClick={() => navigate('/history')}>
                  Historial de alertas
                </button>
                <button type="button" className="auth-button-primary">
                  Alertas personalizadas
                </button>
                <button type="button" className="auth-button-primary" onClick={() => navigate('/settings')}>
                  Ajustes de cuenta
                </button>
              </div>
            </div>

            {/* Info detallada del usuario */}
            <UserPanelInfo />
          </div>
        </div>
      </section>

      {/* Gestor de etiquetas personalizadas */}
      <section className="center-card center-card-bottom">
        <TagManager />
      </section>
    </BasePageLayout>
  );
}

export default UserPanelPage;
