/**
 * Componente: LoginForm
 * Propósito: Formulario de inicio de sesión con campos de email, password, checkbox remember me y botones de Sign in/Register.
 * Uso:
 *  - LoginPage.jsx (único lugar donde se renderiza)
 * Dependencias:
 *  - auth.css (.auth-form, .auth-field, .auth-label, .auth-input, .auth-form-footer, .auth-remember, .auth-checkbox, .auth-actions, .auth-button-primary, .auth-button-secondary)
 */

// frontend/src/components/features/auth/LoginForm.jsx
import { Link } from "react-router-dom";

function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: send login data to backend
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className="auth-input"
          placeholder="SomosLaHostia@SuperKode.com"
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="auth-input"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="auth-form-footer">
        <div className="auth-remember">
          <input id="remember-me" type="checkbox" className="auth-checkbox" />
          <label htmlFor="remember-me" className="auth-remember-label">
            Remember me
          </label>
        </div>

        {/* Botones Sign in + Register en la misma fila */}
        <div className="auth-actions">
          <button type="submit" className="auth-button-primary">
            Sign in
          </button>

          <Link to="/register" className="auth-button-secondary">
            Register
          </Link>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
