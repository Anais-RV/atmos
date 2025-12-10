/**
 * FEATURE: Auth
 * Componentes incluidos:
 *  - AuthCard: tarjeta base reutilizable para páginas de autenticación con título y subtítulo.
 *  - LoginForm: formulario de inicio de sesión con email, password y remember me.
 *  - RegisterForm: formulario de registro con nombre, email, password y confirmación.
 *  - UserPanelInfo: información del usuario autenticado (avatar, nombre, email, acciones).
 *  - DataProtectionNotice: aviso legal breve sobre protección de datos con enlace a página completa.
 *
 * Páginas que usan este feature:
 *  - LoginPage.jsx (usa LoginForm + DataProtectionNotice)
 *  - RegisterPage.jsx (usa AuthCard + RegisterForm)
 *  - UserPanelPage.jsx (usa UserPanelInfo)
 *  - DataProtectionPage.jsx (usa AuthCard)
 *
 * Estilos:
 *  - auth.css (334 líneas, selectores .auth-* y .user-panel-*)
 */

/**
 * Componente: AuthCard
 * Propósito: Tarjeta contenedora reutilizable para páginas de autenticación con header opcional.
 * Uso:
 *  - RegisterPage.jsx (formulario de registro)
 *  - DataProtectionPage.jsx (contenido legal)
 * Dependencias:
 *  - auth.css (.auth-card, .auth-card-header, .auth-card-title, .auth-card-subtitle, .auth-card-body)
 */

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
