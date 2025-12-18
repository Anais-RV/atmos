// src/pages/PasswordResetPage.jsx

import { useState } from "react";
import BasePageLayout from "../components/layout/BasePageLayout";
import PasswordResetRequest from "../components/auth/passwordreset/PasswordResetMail";
import PasswordResetForm from "../components/auth/passwordreset/PasswordResetForm";
import { getTemperatureColor } from "../styles/temperatureColors";

function PasswordResetPage() {
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);
  const [recoveryMethod, setRecoveryMethod] = useState("link"); // "link" o "form"

  return (
    <BasePageLayout title="Recuperar contraseña" description="" containerColor={containerColor}>
      <section className="auth-card auth-password-reset-card">
        <div className="auth-login-inner">
          <div className="auth-login-content">
            <header className="auth-card-header">
              <h1 className="auth-card-title">Recuperar contraseña</h1>
              <p className="auth-card-subtitle">
                {recoveryMethod === "link" 
                  ? "Te enviaremos un enlace para restablecerla."
                  : "Ingresa tu correo y nueva contraseña para recuperar tu cuenta."}
              </p>
            </header>

            {/* Selector de método de recuperación */}
            <div className="auth-recovery-method-selector">
              <button
                className={`auth-method-btn ${recoveryMethod === "link" ? "active" : ""}`}
                onClick={() => setRecoveryMethod("link")}
              >
                📧 Enlace de recuperación
              </button>
              <button
                className={`auth-method-btn ${recoveryMethod === "form" ? "active" : ""}`}
                onClick={() => setRecoveryMethod("form")}
              >
                🔑 Formulario directo
              </button>
            </div>

            {/* Mostrar componente según la opción seleccionada */}
            {recoveryMethod === "link" ? (
              <PasswordResetRequest />
            ) : (
              <PasswordResetForm />
            )}
          </div>
        </div>
      </section>
    </BasePageLayout>
  );
}

export default PasswordResetPage;
