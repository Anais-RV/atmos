// src/components/layout/Footer.jsx

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner" aria-label="footer menu">
        {/* Tres huecos centrados para futuros componentes de botones */}
        <div className="footer-slots">
          <div className="footer-slot">
            <span className="footer-slot-placeholder">Historial</span>
            <span className="sr-only">Historial</span>
          </div>
          <div className="footer-slot">
            <span className="footer-slot-placeholder">Gráficas</span>
            <span className="sr-only">Gráficas</span>
          </div>
          <div className="footer-slot">
            <span className="footer-slot-placeholder">Predicción</span>
            <span className="sr-only">Predicción</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
