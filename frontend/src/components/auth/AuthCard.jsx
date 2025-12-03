// frontend/src/components/auth/AuthCard.jsx
import PropTypes from 'prop-types';

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

AuthCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default AuthCard;
