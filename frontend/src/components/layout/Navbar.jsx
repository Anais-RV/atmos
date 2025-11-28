// src/components/layout/Navbar.jsx

function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {/* IZQUIERDA: CAMPANA NOTIFICACIONES */}
        <div className="navbar-left">
          <button
            className="navbar-icon-button"
            aria-label="Notifications"
            type="button"
          >
            <span className="navbar-bell">🔔</span>
            <span className="navbar-notification-dot" />
          </button>
        </div>

        {/* CENTRO: MARCA ATMOS */}
        <div className="navbar-center">
          <span className="navbar-brand-text">
            <span className="navbar-brand-main">ATMOS</span>
            <span className="navbar-brand-sub">climate intelligence</span>
          </span>
        </div>

        {/* DERECHA: MENÚ DESPLEGABLE + SIGN IN */}
        <div className="navbar-right">
          <button
            className="navbar-menu-button"
            type="button"
            aria-label="Open menu"
          >
            ⋮
          </button>

          <button className="navbar-cta" type="button">
            Sign in
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
