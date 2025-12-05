// frontend/src/components/layout/FooterActions.jsx
import { Link, useLocation } from "react-router-dom";

function FooterActions() {
  const location = useLocation();
  const pathname = location.pathname;

  const slots = [
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
      label: "Predicciones",
      // de momento usamos el dashboard como “predicciones”
      to: "/",
    },
  ];

  const isActive = (to) => {
    if (to === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(to);
  };

  return (
    <div className="footer-slots">
      {slots.map((slot) => (
        <Link
          key={slot.key}
          to={slot.to}
          className={
            "footer-slot" + (isActive(slot.to) ? " footer-slot--active" : "")
          }
        >
          <span className="footer-slot-label">{slot.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default FooterActions;
