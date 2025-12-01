// frontend/src/pages/UserPanelPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import UserPanelInfo from "../auth/UserPanelInfo";
import { getTemperatureColor } from "../styles/temperatureColors";

function UserPanelPage() {
  // Si quieres que sea igual que el Login/Dashboard, usa también 7
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  // TODO: este nombre vendrá del usuario autenticado
  const userName = "Usuario";

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <section className="auth-card auth-login-card">
        <div className="auth-login-inner">
          {/* Avatar del usuario (arriba en móvil, a la izquierda en pantallas grandes) */}
          <div className="auth-login-avatar">
            <span className="auth-login-avatar-initial">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Contenido del panel de usuario */}
          <div className="auth-login-content">
            <header className="auth-card-header">
              <h1 className="auth-card-title">Bienvenido, {userName}</h1>
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
                <button type="button" className="auth-button-primary">
                  Etiquetas personalizadas
                </button>
                <button type="button" className="auth-button-primary">
                  Historial de alertas
                </button>
                <button type="button" className="auth-button-primary">
                  Alertas personalizadas
                </button>
                <button type="button" className="auth-button-primary">
                  Ajustes de cuenta
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
