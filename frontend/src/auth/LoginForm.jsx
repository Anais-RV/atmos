// frontend/src/components/auth/LoginForm.jsx

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
            Recuérdame
          </label>
        </div>

        <button type="submit" className="auth-button-primary">
          Sign in
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
