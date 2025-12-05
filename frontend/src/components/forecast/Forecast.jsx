// frontend/src/components/forecast/Forecast.jsx

import { useNavigate } from "react-router-dom";

function Forecast() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/forecast-extended"); // ⬅️ va a la nueva página
  };

  // Más adelante aquí irán los datos reales de predicción IA PROPHET
  return (
    <div
      className="forecast-placeholder forecast-clickable"
      onClick={handleClick}
    >
      <p className="forecast-placeholder-text">
        Aquí se mostrará la predicción meteorológica y las gráficas correspondientes.
        <br />
        <strong>Haz clic para ver la versión extendida.</strong>
      </p>
    </div>
  );
}

export default Forecast;
