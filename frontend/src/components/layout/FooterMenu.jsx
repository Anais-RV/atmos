// src/components/layout/FooterMenu.jsx
import { Link, useLocation } from "react-router-dom";

function FooterMenu() {
  const location = useLocation();
  const pathname = location.pathname;

  const items = [
    {
      key: "history",
      label: "Historial",
      to: "/history",
    },
    {
      key: "charts",
      label: "Gráficas",
      to: "/charts",
    },
    {
      key: "predictions",
      label: "Predicción",
      to: "/", // usamos el dashboard como página de predicciones
    },
  ];

  const isActive = (to) => pathname === to;

  return (
    <div className="footer-slots">
      {items.map((item) => (
        <Link
          key={item.key}
          to={item.to}
          className={
            "footer-slot" + (isActive(item.to) ? " footer-slot--active" : "")
          }
          aria-label={item.label}
          aria-current={isActive(item.to) ? "page" : undefined}
        >
          <span className="footer-slot-label">{item.label}</span>
          {/* Texto solo para lectores de pantalla */}
          <span className="sr-only">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default FooterMenu;
