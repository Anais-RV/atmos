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
