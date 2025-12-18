/**
 * Componente: Navbar
 * Propósito: Barra de navegación superior de la aplicación con notificaciones, logo y menú hamburguesa.
 * Uso:
 *  - Renderizado en BasePageLayout, por lo tanto presente en todas las páginas de la aplicación
 *  - Contiene: botón de notificaciones (izquierda), logo ATMOS (centro), HamburgerMenu (derecha)
 * Tipo:
 *  - Componente de layout global (navegación principal)
 */

// src/components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import HamburgerMenu from "../ui/HamburgerMenu/HamburgerMenu";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

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
          <Link to="/login" className="navbar-cta">
            Sign in
          </Link>
          <HamburgerMenu />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
