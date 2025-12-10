/**
 * Componente: RegisterForm
 * Propósito: Formulario de registro de nuevos usuarios con campos de nombre, email, password, confirmación y enlace a login.
 * Uso:
 *  - RegisterPage.jsx (envuelto en AuthCard)
 * Dependencias:
 *  - auth.css (.auth-form, .auth-field, .auth-label, .auth-input, .auth-form-footer, .auth-button-primary, .auth-footer-text, .auth-link)
 */

// frontend/src/components/features/auth/RegisterForm.jsx

import { Link } from "react-router-dom";

function RegisterForm() {
  return (
    <form className="auth-form">
      <div className="auth-field">
        <label htmlFor="name" className="auth-label">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          className="auth-input"
          placeholder="Tu nombre"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          className="auth-input"
          placeholder="tu@email.com"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className="auth-input"
          placeholder="Elige una contraseña segura"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword" className="auth-label">
          Repite la contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="auth-input"
          placeholder="Vuelve a escribir la contraseña"
        />
      </div>

      <div className="auth-form-footer">
        <button type="submit" className="auth-button-primary">
          Crear cuenta
        </button>

        <p className="auth-footer-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="auth-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
