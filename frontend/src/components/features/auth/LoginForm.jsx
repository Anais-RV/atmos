// frontend/src/components/features/auth/LoginForm.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "El email es obligatorio";
        } else if (!EMAIL_REGEX.test(value)) {
          error = "El formato del email no es válido";
        }
        break;

      case "password":
        if (!value) {
          error = "La contraseña es obligatoria";
        } else if (value.length < 8) {
          error = "La contraseña debe tener al menos 8 caracteres";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (name !== "remember") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, fieldValue),
      }));
    }
  };

  const isFormValid =
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    !errors.email &&
    !errors.password;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    // TODO: enviar datos al backend
    console.log("Login válido:", formData);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          className="auth-input"
          placeholder="usuario@email.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="auth-error">{errors.email}</p>}
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
        />
        {errors.password && (
          <p className="auth-error">{errors.password}</p>
        )}
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

        <div className="auth-actions">
          <button
            type="submit"
            className="auth-button-primary"
            disabled={!isFormValid}
          >
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
