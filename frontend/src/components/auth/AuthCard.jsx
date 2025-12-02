// frontend/src/components/auth/AuthCard.jsx

function AuthCard({ title, subtitle, children }) {
  return (
    <section className="auth-card">
      {(title || subtitle) && (
        <header className="auth-card-header">
          {title && <h1 className="auth-card-title">{title}</h1>}
          {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
        </header>
      )}

      <div className="auth-card-body">
        {children}
      </div>
    </section>
  );
}

export default AuthCard;
