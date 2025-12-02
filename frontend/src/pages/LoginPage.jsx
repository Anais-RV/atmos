// src/pages/LoginPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import LoginForm from "../components/auth/LoginForm";
import DataProtectionNotice from "../components/auth/DataProtectionNotice";
import { getTemperatureColor } from "../styles/temperatureColors";

function LoginPage() {
  // MISMA temperatura que en DashboardPage
  const temperatureC = 7; // usa el mismo valor que en DashboardPage
  const containerColor = getTemperatureColor(temperatureC);

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
            {/* De momento una letra genérica; luego podrás poner la foto real */}
            <span className="auth-login-avatar-initial">U</span>
          </div>

          {/* Contenido de login */}
          <div className="auth-login-content">
            <header className="auth-card-header">
              <h1 className="auth-card-title">Bienvenido de nuevo</h1>
              <p className="auth-card-subtitle">
                Inicia sesión para acceder a tu panel de ATMOS.
              </p>
            </header>

            <LoginForm />
            <DataProtectionNotice />
          </div>
        </div>
      </section>
    </BasePageLayout>
  );
}

export default LoginPage;
