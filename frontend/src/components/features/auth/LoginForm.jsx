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
import authService from "../../../services/authService";

function LoginForm() {
  const navigate = useNavigate();
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
      console.log('[LoginForm] Iniciando login...');
      await authService.login(formData.email, formData.password);
      console.log('[LoginForm] Login completado');
      
      const token = localStorage.getItem('access_token');
      console.log('[LoginForm] Token después del login:', token ? `${token.substring(0, 20)}...` : 'NULL');
      
      // Pequeño delay para asegurar que el token se guardó en localStorage
      console.log('[LoginForm] Esperando 100ms...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('[LoginForm] Navegando a /user-panel');
      navigate('/user-panel');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
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
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          className="auth-input"
          placeholder="SomosLaHostia@SuperKode.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          className="auth-input"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-forgot">
        <Link to="/password-reset" className="auth-link">
          ¿Olvidaste tu contraseña?
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
            Remember me
          </label>
        </div>

        {/* Botones Sign in + Register en la misma fila */}
        <div className="auth-actions">
          <button 
            type="submit" 
            className="auth-button-primary"
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Sign in'}
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
