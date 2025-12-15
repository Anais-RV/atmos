// src/pages/PasswordResetPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import PasswordResetRequest from "../components/auth/PasswordResetRequest";
import { getTemperatureColor } from "../styles/temperatureColors";

function PasswordResetPage() {
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout title="Recuperar contraseña" description="" containerColor={containerColor}>
      <section className="auth-card auth-password-reset-card">
        <div className="auth-login-inner">
          <div className="auth-login-content">
            <header className="auth-card-header">
              <h1 className="auth-card-title">Recuperar contraseña</h1>
              <p className="auth-card-subtitle">Te enviaremos un enlace para restablecerla.</p>
            </header>

            <PasswordResetRequest />
          </div>
        </div>
      </section>
    </BasePageLayout>
  );
}

export default PasswordResetPage;
