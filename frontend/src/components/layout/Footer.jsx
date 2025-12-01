// src/components/layout/Footer.jsx

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Tres huecos centrados para futuros componentes de botones */}
        <div className="footer-slots">
          <div className="footer-slot">
            <span className="footer-slot-placeholder">Component slot 1</span>
          </div>
          <div className="footer-slot">
            <span className="footer-slot-placeholder">Component slot 2</span>
          </div>
          <div className="footer-slot">
            <span className="footer-slot-placeholder">Component slot 3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
