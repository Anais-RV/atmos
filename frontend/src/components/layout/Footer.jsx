/**
 * Componente: Footer
 * Propósito: Pie de página de la aplicación que contiene el menú de navegación inferior.
 * Uso:
 *  - Renderizado en BasePageLayout, por lo tanto presente en todas las páginas
 *  - Contenedor del componente FooterMenu con los accesos rápidos principales
 * Tipo:
 *  - Componente de layout global (navegación secundaria)
 */

// src/components/layout/Footer.jsx

import { useState, useRef, useEffect } from "react";
import FooterMenu from "./FooterMenu";
import { useLanguage } from "../../context/useLanguage";

function Footer() {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const footerRef = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (footerRef.current && !footerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <footer className="footer-container">
      {/* Navegación - Siempre visible encima del texto de créditos */}
      <div className="footer-nav" aria-label={t('navigation.menu')}>
        <FooterMenu />
      </div>

      {/* Franja de Créditos - Fija abajo, expandible al clicar */}
      <div
        className={`footer-info ${isExpanded ? 'footer-info--expanded' : ''}`}
        ref={footerRef}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="footer-info-bar">
          <p className="footer-info-text">
            Aplicación creada por la turma SuperCoder BootCampFamily FactoriaF5
          </p>
          <span className={`footer-info-chevron ${isExpanded ? 'rotated' : ''}`}>▲</span>
        </div>

        {isExpanded && (
          <div className="footer-info-content">
            <div className="credits-content">
              <img src="/images/super-coders-team.png" alt="Turma SuperCoders" className="credits-image" />
              <div className="credits-message">
                <p>Nuestra turma de SuperCoders fue mucho más que un bootcamp: fue un viaje de más de siete meses compartiendo turbulencias y aprendizajes, risas y lágrimas, emociones intensas y también pequeñas peleas, pero siempre juntos.</p>
                <p>Aprendimos no solo a programar, sino a aprender unos de otros, a convivir con diferentes personalidades, a respetarnos y a entender que todos somos seres humanos, con fallos, pero también con la capacidad de perdonar.</p>
                <p>Y así, cerramos este ciclo con la misma paz con la que lo iniciamos, porque la humildad y el perdón, cuando se combinan, dan lugar a abrazos, apretones de manos y felicitaciones sinceras.</p>
                <p className="credits-highlight">Esta fue una turma de discapacidad en salud, pero con capacidad de guerreros, porque todos somos capaces.</p>
                <p className="credits-thanks">
                  Anais, Yerardin, Andrea, Cris, Calero, Wizi, Julya, Miguel, David, Dani, Roxi, Rubén, Antonio, Sara, Ramazam, Marcus, y también todos aquellos compañeros que por el camino tuvieron que seguir otros rumbos: <strong>gracias</strong>. Gracias por cada 1% de colaboración, por cada idea, por cada esfuerzo puesto en los proyectos que compartimos juntos como equipo.
                </p>
                <p className="credits-closing">
                  Les mando un fuerte abrazo a todos y quiero que sepan que admiro a cada uno individualmente. Son verdaderos guerreros, y haber compartido este camino con ustedes ha sido un honor.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
