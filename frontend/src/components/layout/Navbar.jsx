/**
 * Componente: Navbar
 * Propósito: Barra de navegación superior global
 */

// src/components/layout/Navbar.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HamburgerMenu from "../ui/HamburgerMenu/HamburgerMenu";
import "../../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const goHome = () => {
    setIsLeaving(true);

    // Debe coincidir con la duración CSS
    setTimeout(() => {
      navigate("/");
      setIsLeaving(false);
    }, 420);
  };

  return (
    <header className="navbar" role="banner">
      <nav className="navbar-inner" aria-label="main navigation">

        {/* IZQUIERDA */}
        <div className="navbar-left">
          <button
            className="navbar-icon-button"
            aria-label="View notifications"
            type="button"
          >
            🔔
          </button>
        </div>

        {/* CENTRO: LOGO CON ANIMACIÓN */}
        <div className="navbar-center">
          <button
            type="button"
            onClick={goHome}
            className={`navbar-brand-button ${isLeaving ? "leaving" : ""}`}
            aria-label="Go to homepage"
          >
            <span className="navbar-brand-main">ATMOS</span>
            <span className="navbar-brand-sub">climate intelligence</span>
          </button>
        </div>

        {/* DERECHA */}
        <div className="navbar-right">
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
