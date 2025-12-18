// frontend/src/components/features/auth/RegisterForm.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "El nombre es obligatorio";
        }
        break;

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

      case "confirmPassword":
        if (!value) {
          error = "Debes repetir la contraseña";
        } else if (value !== formData.password) {
          error = "Las contraseñas no coinciden";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const isFormValid =
    Object.values(formData).every((value) => value.trim() !== "") &&
    Object.values(errors).every((error) => !error);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // TODO: enviar datos al backend
    console.log("Registro válido:", formData);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-field">
        <label htmlFor="name" className="auth-label">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="auth-input"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="auth-error">{errors.name}</p>}
      </div>

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="auth-input"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="auth-error">{errors.email}</p>}
      </div>

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="auth-input"
          placeholder="Elige una contraseña segura"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="auth-error">{errors.password}</p>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword" className="auth-label">
          Repite la contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="auth-input"
          placeholder="Vuelve a escribir la contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="auth-error">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="auth-form-footer">
        <button
          type="submit"
          className="auth-button-primary"
          disabled={!isFormValid}
        >
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
