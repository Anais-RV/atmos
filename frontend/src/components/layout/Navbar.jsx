// src/components/layout/Navbar.jsx

function Navbar() {
  return (
    <header className="navbar" role="banner">
      <nav className="navbar-inner" aria-label="main navigation">
        {/* IZQUIERDA: CAMPANA NOTIFICACIONES */}
        <div className="navbar-left" aria-label="notifications section">
          <button
            className="navbar-icon-button"
            aria-label="view notifications"
            type="button"
          >
            <span className="navbar-bell" aria-hidden="true">🔔</span>
            <span className="navbar-notification-dot" aria-hidden="true" />
          </button>
        </div>

        {/* CENTRO: MARCA ATMOS */}
        <div className="navbar-center" aria-label="app branding">
          <span 
            className="navbar-brand-text"
            aria-label="ATMOS - climate intelligence"  
          >
            <span className="navbar-brand-main">ATMOS</span>
            <span className="navbar-brand-sub">climate intelligence</span>
          </span>
        </div>

        {/* DERECHA: MENÚ DESPLEGABLE + SIGN IN */}
        <div className="navbar-right" aria-label="account options">
          <button
            className="navbar-menu-button"
            type="button"
            aria-label="open menu"
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
