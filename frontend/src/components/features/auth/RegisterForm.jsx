/**
 * Componente: RegisterForm
 * Propósito: Formulario de registro de nuevos usuarios con campos de nombre, email, password, confirmación y enlace a login.
 * Uso:
 *  - RegisterPage.jsx (envuelto en AuthCard)
 * Dependencias:
 *  - auth.css (.auth-form, .auth-field, .auth-label, .auth-input, .auth-form-footer, .auth-button-primary, .auth-footer-text, .auth-link)
 */

// frontend/src/components/features/auth/RegisterForm.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import { useLanguage } from "../../../context/useLanguage";

function RegisterForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch') || "Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError(t('auth.passwordMinLength') || "La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      setSuccess(true);
      // Redirigir al login tras 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form" style={{textAlign: 'center', padding: '20px'}}>
        <div style={{color: '#2c3', backgroundColor: '#efe', padding: '15px', borderRadius: '4px'}}>
          ✓ {t('auth.registerSuccess') || 'Usuario creado exitosamente'}. {t('common.loading')}...
        </div>
      </div>
    );
  }

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
        <label htmlFor="name" className="auth-label">
          {t('auth.fullName')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="auth-input"
          placeholder={t('auth.namePlaceholder')}
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          {t('auth.email')}
        </label>
        <input
          id="email"
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
        <label htmlFor="password" className="auth-label">
          {t('auth.password')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="auth-input"
          placeholder={t('auth.passwordPlaceholder')}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword" className="auth-label">
          {t('auth.confirmPassword')}
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="auth-input"
          placeholder={t('auth.confirmPasswordPlaceholder')}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-form-footer">
        <button 
          type="submit" 
          className="auth-button-primary"
          disabled={loading}
        >
          {loading ? t('auth.creating') || 'Creando...' : t('auth.createAccount')}
        </button>

        <p className="auth-footer-text">
          {t('auth.haveAccount')} {" "}
          <Link to="/login" className="auth-link">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
