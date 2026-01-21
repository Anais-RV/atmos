/**
 * Componente: Navbar
 * Propósito: Barra de navegación superior global
 */

// src/components/layout/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../ui/HamburgerMenu/HamburgerMenu";
import "../../styles/Navbar.css";
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'

function Navbar() {
  const navigate = useNavigate();
  const [leavingTarget, setLeavingTarget] = useState(null);
  const { user } = useAuth()
  const { t } = useLanguage()

  const animateAndNavigate = (target) => {
    setLeavingTarget(target);

    setTimeout(() => {
      if (target === "home") navigate("/");
      if (target === "login") navigate("/login");
      if (target === "user") navigate("/user-panel");
      setLeavingTarget(null);
    }, 420);
  };

  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.username || null

  return (
    <header className="navbar" role="banner">
      <nav className="navbar-inner" aria-label="main navigation">

        {/* IZQUIERDA */}
        <div className="navbar-left">
          <button
            className="navbar-icon-button"
            aria-label={t('navbar.notificationsComingSoon')}
            type="button"
            title={t('navbar.notificationsComingSoon')}
          >
            🔔
          </button>
        </div>

        {/* CENTRO */}
        <div className="navbar-center">
          <button
            type="button"
            onClick={() => animateAndNavigate("home")}
            className={`navbar-brand-button nav-animatable ${
              leavingTarget === "home" ? "leaving" : ""
            }`}
            aria-label={t('navigation.dashboard')}
          >
            <span className="navbar-brand-main">ATMOS</span>
            <span className="navbar-brand-sub">climate intelligence</span>
          </button>
        </div>

        {/* DERECHA */}
        <div className="navbar-right">
          <button
            type="button"
            onClick={() => animateAndNavigate(displayName ? 'user' : 'login')}
            className={`navbar-cta nav-animatable ${
              leavingTarget === (displayName ? 'user' : 'login') ? "leaving" : ""
            }`}
          >
            {displayName || t('navbar.signIn')}
          </button>

          {/* ❌ SIN animación de salida */}
          <HamburgerMenu />
        </div>

      </nav>
    </header>
  );
}

export default Navbar;
