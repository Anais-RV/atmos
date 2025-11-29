// frontend/src/components/auth/RegisterForm.jsx

function RegisterForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: send register data to backend
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label className="auth-label" htmlFor="register-name">
          Full name
        </label>
        <input
          id="register-name"
          type="text"
          className="auth-input"
          placeholder="Your name"
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          className="auth-input"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          className="auth-input"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="register-confirm">
          Confirm password
        </label>
        <input
          id="register-confirm"
          type="password"
          className="auth-input"
          placeholder="Repeat your password"
          required
        />
      </div>

      <div className="auth-form-footer">
        <span className="auth-footer-text">
          By creating an account you accept our{" "}
          <a href="/data-protection" className="auth-link">
            data protection policy
          </a>.
        </span>

        <button type="submit" className="auth-button-primary">
          Create account
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
