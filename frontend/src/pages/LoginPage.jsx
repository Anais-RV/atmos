/**
 * Página: LoginPage
 * Propósito: Formulario de inicio de sesión con avatar de usuario.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - LoginForm (formulario con email, password, remember me)
 *  - DataProtectionNotice (aviso de protección de datos)
 * Feature/dominio: auth
 * Tipo: Página de formulario (autenticación)
 */

// src/pages/LoginPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import LoginForm from "../components/features/auth/LoginForm";
import DataProtectionNotice from "../components/features/auth/DataProtectionNotice";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useLanguage } from "../context/useLanguage";

function LoginPage() {
  const { t } = useLanguage();
  const temperatureC = 7;
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
            <span className="auth-login-avatar-initial">U</span>
          </div>

          {/* Contenido de login */}
          <div className="auth-login-content">
            <header className="auth-card-header">
              <h1 className="auth-card-title">{t('auth.welcomeBack')}</h1>
              <p className="auth-card-subtitle">
                {t('auth.loginDescription')}
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
