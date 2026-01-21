import { useState } from "react";
import BasePageLayout from "../components/layout/BasePageLayout";
import PasswordResetRequest from "../components/auth/passwordreset/PasswordResetMail";
import PasswordResetForm from "../components/auth/passwordreset/PasswordResetForm";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useLanguage } from "../context/useLanguage";
import "../styles/password_reset.css";

function PasswordResetPage() {
  const { t } = useLanguage();
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);
  const [recoveryMethod, setRecoveryMethod] = useState("link"); // "link" | "form"

  return (
    <BasePageLayout
      title={t('auth.resetPassword')}
      description=""
      containerColor={containerColor}
    >
      <section className="auth-card auth-password-reset-card">
        <div className="auth-login-inner">
          <div className="auth-login-content">
            <header className="auth-card-header">
              <h1 className="auth-card-title">{t('auth.resetPassword')}</h1>
              <p className="auth-card-subtitle">
                {recoveryMethod === "link"
                  ? t('auth.resetSubtitleLink')
                  : t('auth.resetSubtitleForm')}
              </p>
            </header>

            {/* Selector de método de recuperación */}
            <div className="auth-recovery-method-selector">
              <button
                type="button"
                className={`auth-method-btn ${
                  recoveryMethod === "link" ? "active" : ""
                }`}
                onClick={() => setRecoveryMethod("link")}
              >
                {t('auth.recoveryMethodLink')}
              </button>

              <button
                type="button"
                className={`auth-method-btn ${
                  recoveryMethod === "form" ? "active" : ""
                }`}
                onClick={() => setRecoveryMethod("form")}
              >
                {t('auth.recoveryMethodForm')}
              </button>
            </div>

            {/* Contenido dinámico */}
            <div className="auth-password-reset-content">
              {recoveryMethod === "link" ? (
                <PasswordResetRequest />
              ) : (
                <PasswordResetForm />
              )}
            </div>
          </div>
        </div>
      </section>
    </BasePageLayout>
  );
}

export default PasswordResetPage;
