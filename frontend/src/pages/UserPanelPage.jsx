/**
 * Página: UserPanelPage
 * Propósito: Panel de usuario autenticado con información del perfil y accesos rápidos.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - UserPanelInfo (información detallada del usuario: nombre, email, acciones)
 * Feature/dominio: auth
 * Tipo: Página de panel (dashboard de usuario con botones de acción)
 */

// frontend/src/pages/UserPanelPage.jsx

import { useNavigate } from "react-router-dom";
import BasePageLayout from "../components/layout/BasePageLayout";
import UserPanelInfo from "../components/features/auth/UserPanelInfo";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useAuth } from '../context/AuthContext'
import { useLanguage } from "../context/useLanguage";

function UserPanelPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
              <h1 className="auth-card-title">{user ? `${t('userPanel.welcome')}, ${userName}` : t('userPanel.welcome')}</h1>
              <p className="auth-card-subtitle">
                {t('userPanel.manageProfile')}
              </p>
            </header>

            {/* Bloque azul con botones tipo "Sign in" */}
            <div className="user-panel-actions-card">
              <p className="user-panel-actions-text">
                {t('userPanel.quickAccess')}
              </p>
              <div className="user-panel-actions-buttons">
                <button type="button" className="auth-button-primary" onClick={() => navigate('/history')}>
                  {t('userPanel.alertHistory')}
                </button>
                <button type="button" className="auth-button-primary">
                  {t('userPanel.customAlerts')}
                </button>
                <button type="button" className="auth-button-primary" onClick={() => navigate('/settings')}>
                  {t('userPanel.accountSettings')}
                </button>
              </div>
            </div>

            {/* Info detallada del usuario */}
            <UserPanelInfo />
          </div>
        </div>
      </section>
    </BasePageLayout>
  );
}

export default UserPanelPage;
