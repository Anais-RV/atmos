// frontend/src/components/ui/HamburgerMenu/HamburgerMenu.jsx
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./HamburgerMenu.css";
import { ThemeContext } from "../../../context/ThemeContext";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccOpen, setIsAccOpen] = useState(false);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => {
    setIsOpen(false);
    setIsLangOpen(false);
    setIsAccOpen(false);
  };
  const toggleLanguages = () => setIsLangOpen((prev) => !prev);
  const toggleAccessibility = () => setIsAccOpen((prev) => !prev);

  return (
    <div className="hamburger-menu-wrapper">
      {/* Botón principal */}
      <button
        type="button"
        className={`navbar-menu-button ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Abrir menú"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="hamburger-menu-backdrop show"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div className={`hamburger-menu-panel ${isOpen ? "open" : ""}`}>
        <ul className="hamburger-menu-list">

          {/* Menu de usuario */}
          <li className="hamburger-menu-item">
            <Link
              to="/user-panel"
              className="hamburger-menu-link"
              onClick={closeMenu}
            >
              👤
              <div className="menu-text">
                <span className="hamburger-menu-item-title">Menu de usuario</span>
                <span className="hamburger-menu-item-sub">Ver tu panel y preferencias</span>
              </div>
            </Link>
          </li>

          {/* Modo oscuro / claro */}
          <li className="hamburger-menu-item">
            <button
              type="button"
              className="hamburger-menu-button-row"
              onClick={() => {
                toggleTheme();
                closeMenu();
              }}
            >
              {isDarkMode ? "🌙" : "🌞"}
              <div className="menu-text">
                <span className="hamburger-menu-item-title">
                  {isDarkMode ? "Modo claro" : "Modo oscuro"}
                </span>
                <span className="hamburger-menu-item-sub">Ajustar tema de la interfaz</span>
              </div>
            </button>
          </li>

          {/* Idiomas */}
          <li className="hamburger-menu-item">
            <button
              type="button"
              className="hamburger-menu-button-row"
              onClick={toggleLanguages}
              aria-expanded={isLangOpen}
            >
              🌐
              <div className="menu-text">
                <span className="hamburger-menu-item-title">Idiomas</span>
                <span className="hamburger-menu-item-sub">Cambiar idioma de la app</span>
              </div>
            </button>

            {isLangOpen && (
              <ul className="hamburger-submenu">
                <li><button type="button" onClick={closeMenu}>🇪🇸 Español</button></li>
                <li><button type="button" onClick={closeMenu}>🇺🇸 Inglés</button></li>
                <li><button type="button" onClick={closeMenu}>🇷🇺 Ruso</button></li>
                <li><button type="button" onClick={closeMenu}>🇧🇷 Brasileño</button></li>
              </ul>
            )}
          </li>

          {/* Accesibilidad */}
          <li className="hamburger-menu-item">
            <button
              type="button"
              className="hamburger-menu-button-row"
              onClick={toggleAccessibility}
              aria-expanded={isAccOpen}
            >
              ♿
              <div className="menu-text">
                <span className="hamburger-menu-item-title">Accesibilidad</span>
                <span className="hamburger-menu-item-sub">Ajustes de discapacidad</span>
              </div>
            </button>

            {isAccOpen && (
              <ul className="hamburger-submenu">
                <li><button type="button" onClick={closeMenu}>👁️‍🗨️ Discapacidad visual</button></li>
                <li><button type="button" onClick={closeMenu}>🦻 Subtitulado ST</button></li>
                <li><button type="button" onClick={closeMenu}>🧑‍🦯 Sordo-ciego</button></li>
              </ul>
            )}
          </li>

        </ul>
      </div>
    </div>
  );
}

export default HamburgerMenu;
