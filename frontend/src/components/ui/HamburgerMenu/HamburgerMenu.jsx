// frontend/src/components/ui/HamburgerMenu/HamburgerMenu.jsx
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Sun, 
  Moon, 
  Globe, 
  Accessibility,
  Eye,
  Ear,
  UserX 
} from "lucide-react";
import "./HamburgerMenu.css";
import { ThemeContext } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/useLanguage";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccOpen, setIsAccOpen] = useState(false);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage, t } = useLanguage();

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
        aria-label={t('hamburger.menu')}
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
          <li className="hamburger-menu-item hamburger-menu-item-first">
            <Link
              to="/user-panel"
              className="hamburger-menu-link"
              onClick={closeMenu}
            >
              <User size={20} />
              <div className="menu-text">
                <span className="hamburger-menu-item-title">{t('hamburger.userMenu')}</span>
                <span className="hamburger-menu-item-sub">{t('hamburger.viewPanel')}</span>
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
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              <div className="menu-text">
                <span className="hamburger-menu-item-title">
                  {isDarkMode ? t('hamburger.lightMode') : t('hamburger.darkMode')}
                </span>
                <span className="hamburger-menu-item-sub">{t('hamburger.themeSub')}</span>
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
              <Globe size={20} />
              <div className="menu-text">
                <span className="hamburger-menu-item-title">{t('hamburger.languages')}</span>
                <span className="hamburger-menu-item-sub">{t('hamburger.changeLanguage')}</span>
              </div>
            </button>

            {isLangOpen && (
              <ul className="hamburger-submenu">
                <li>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLanguage('es');
                      closeMenu();
                    }}
                    className={language === 'es' ? 'active' : ''}
                  >
                    🇪🇸 {t('hamburger.spanish')}
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLanguage('en');
                      closeMenu();
                    }}
                    className={language === 'en' ? 'active' : ''}
                  >
                    🇺🇸 {t('hamburger.english')}
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLanguage('pt');
                      closeMenu();
                    }}
                    className={language === 'pt' ? 'active' : ''}
                  >
                    🇵🇹 {t('hamburger.portuguese')}
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLanguage('pt_BR');
                      closeMenu();
                    }}
                    className={language === 'pt_BR' ? 'active' : ''}
                  >
                    🇧🇷 {t('hamburger.brazilianPortuguese')}
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLanguage('ru');
                      closeMenu();
                    }}
                    className={language === 'ru' ? 'active' : ''}
                  >
                    🇷🇺 {t('hamburger.russian')}
                  </button>
                </li>
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
              <Accessibility size={20} />
              <div className="menu-text">
                <span className="hamburger-menu-item-title">{t('hamburger.accessibility')}</span>
                <span className="hamburger-menu-item-sub">{t('hamburger.disabilitySettings')}</span>
              </div>
            </button>

            {isAccOpen && (
              <ul className="hamburger-submenu">
                <li><button type="button" onClick={closeMenu}><Eye size={16} /> {t('hamburger.visualDisability')}</button></li>
                <li><button type="button" onClick={closeMenu}><Ear size={16} /> {t('hamburger.subtitles')}</button></li>
                <li><button type="button" onClick={closeMenu}><UserX size={16} /> {t('hamburger.deafBlind')}</button></li>
              </ul>
            )}
          </li>

        </ul>
      </div>
    </div>
  );
}

export default HamburgerMenu;
