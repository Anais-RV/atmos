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

import FooterMenu from "./FooterMenu";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner" aria-label="footer menu">
        {/* Tres huecos centrados para componentes de botones */}
        <FooterMenu />
      </div>
    </footer>
  );
}

export default Footer;
