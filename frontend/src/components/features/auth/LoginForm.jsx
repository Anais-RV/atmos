/**
 * Componente: LoginForm
 * Propósito: Formulario de inicio de sesión con campos de email, password, checkbox remember me y botones de Sign in/Register.
 * Uso:
 *  - LoginPage.jsx (único lugar donde se renderiza)
 * Dependencias:
 *  - auth.css (.auth-form, .auth-field, .auth-label, .auth-input, .auth-form-footer, .auth-remember, .auth-checkbox, .auth-actions, .auth-button-primary, .auth-button-secondary)
 */

// frontend/src/components/features/auth/LoginForm.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/useLanguage";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/user-panel');
    } catch (err) {
      setError(err.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="auth-error" style={{
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">
          {t('auth.email')}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          className="auth-input"
          placeholder={t('auth.emailPlaceholder')}
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">
          {t('auth.password')}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          className="auth-input"
          placeholder={t('auth.passwordPlaceholder')}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-forgot">
        <Link to="/password-reset" className="auth-link">
          {t('auth.forgotPassword')}
        </Link>
      </div>

      <div className="auth-form-footer">
        <div className="auth-remember">
          <input 
            id="remember-me" 
            name="remember"
            type="checkbox" 
            className="auth-checkbox"
            checked={formData.remember}
            onChange={handleChange}
          />
          <label htmlFor="remember-me" className="auth-remember-label">
            {t('auth.rememberMe')}
          </label>
        </div>

        {/* Botones Sign in + Register en la misma fila */}
        <div className="auth-actions">
          <button 
            type="submit" 
            className="auth-button-primary"
            disabled={loading}
          >
            {loading ? t('auth.signing') : t('auth.signIn')}
          </button>

          <Link to="/register" className="auth-button-secondary">
            {t('auth.register')}
          </Link>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
