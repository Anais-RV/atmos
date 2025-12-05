// frontend/src/components/hamburguer_menu/HamburgerMenu.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccOpen, setIsAccOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const closeMenu = () => {
    setIsOpen(false);
    setIsLangOpen(false);
    setIsAccOpen(false);
  };

  const toggleLanguages = () => {
    setIsLangOpen((prev) => !prev);
  };

  const toggleAccessibility = () => {
    setIsAccOpen((prev) => !prev);
  };

  const handleLanguageSelect = (lang) => {
    console.log("Idioma seleccionado:", lang);
    closeMenu();
  };

  const handleAccessibilitySelect = (mode) => {
    console.log("Modo de accesibilidad seleccionado:", mode);
    closeMenu();
  };

  return (
    <div className="hamburger-menu-wrapper">
      {/* Botón del menú */}
      <button
        type="button"
        className="navbar-menu-button"
        onClick={toggleMenu}
        aria-label="Abrir menú"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {isOpen && (
        <>
          {/* Clic fuera para cerrar */}
          <div
            className="hamburger-menu-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Panel principal */}
          <div className="hamburger-menu-panel">
            <ul className="hamburger-menu-list">
              {/* Menu de usuario */}
              <li className="hamburger-menu-item">
                <Link
                  to="/user-panel"
                  className="hamburger-menu-link"
                  onClick={closeMenu}
                >
                  <span className="hamburger-menu-item-title">
                    Menu de usuario
                  </span>
                  <span className="hamburger-menu-item-sub">
                    Ver tu panel y preferencias
                  </span>
                </Link>
              </li>

              {/* Modo oscuro */}
              <li className="hamburger-menu-item">
                <button
                  type="button"
                  className="hamburger-menu-button-row"
                  onClick={() => {
                    console.log("Toggle Modo Oscuro");
                    closeMenu();
                  }}
                >
                  <span className="hamburger-menu-item-title">Modo Oscuro</span>
                  <span className="hamburger-menu-item-sub">
                    Ajustar tema de la interfaz
                  </span>
                </button>
              </li>

              {/* Idiomas + submenú */}
              <li className="hamburger-menu-item">
                <button
                  type="button"
                  className="hamburger-menu-button-row"
                  onClick={toggleLanguages}
                  aria-expanded={isLangOpen}
                >
                  <span className="hamburger-menu-item-title">Idiomas</span>
                  <span className="hamburger-menu-item-sub">
                    Cambiar el idioma de la app
                  </span>
                </button>

                {isLangOpen && (
                  <ul className="hamburger-submenu">
                    <li>
                      <button
                        type="button"
                        className="hamburger-submenu-button"
                        onClick={() => handleLanguageSelect("Español")}
                      >
                        Español
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="hamburger-submenu-button"
                        onClick={() => handleLanguageSelect("Inglés")}
                      >
                        Inglés
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="hamburger-submenu-button"
                        onClick={() => handleLanguageSelect("Ruso")}
                      >
                        Ruso
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="hamburger-submenu-button"
                        onClick={() => handleLanguageSelect("Brasileño")}
                      >
                        Brasileño
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Accesibilidad + submenú */}
              <li className="hamburger-menu-item">
                <button
                  type="button"
                  className="hamburger-menu-button-row"
                  onClick={toggleAccessibility}
                  aria-expanded={isAccOpen}
                >
                  <span className="hamburger-menu-item-title">
                    Accesibilidad
                  </span>
                  <span className="hamburger-menu-item-sub">
                    Ajustes según discapacidad
                  </span>
                </button>

                {isAccOpen && (
                  <ul className="hamburger-submenu">
                    <li>
                      <button
                        type="button"
                        className="hamburger-submenu-button"
                        onClick={() => handleAccessibilitySelect("Discapacidad Visual")}
                      >
                        Discapacidad visual
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="hamburger-submenu-button"
                        onClick={() => handleAccessibilitySelect("Sordos")}
                      >
                        Subtitulado ST
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="hamburger-submenu-button"
                        onClick={() => handleAccessibilitySelect("Sordo-ciego")}
                      >
                        Accesibilidad sordoceguera
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default HamburgerMenu;
