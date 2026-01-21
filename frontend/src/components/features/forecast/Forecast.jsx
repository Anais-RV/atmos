/**
 * FEATURE: Forecast
 * Componentes incluidos:
 *  - Forecast: componente placeholder para predicción meteorológica con navegación a vista extendida.
 *  - ForecastChart: componente placeholder para gráficos de predicción.
 *
 * Páginas que usan este feature:
 *  - ForecastPage.jsx (usa Forecast)
 *  - ForecastExtendedPage.jsx (vista ampliada sin componente específico aún)
 *  - ForecastChartPage.jsx (usa ForecastChart)
 *
 * Estilos:
 *  - forecast.css (estilos para componente Forecast y layout de predicciones)
 *  - charts.css (estilos específicos para gráficos)
 */

/**
 * Componente: Forecast
 * Propósito: Placeholder para predicción meteorológica con navegación clickable a vista extendida.
 * Uso:
 *  - ForecastPage.jsx (único lugar donde se renderiza)
 * Dependencias:
 *  - forecast.css (.forecast-placeholder, .forecast-clickable, .forecast-placeholder-text)
 *  - react-router-dom (useNavigate para navegación a /forecast-extended)
 */

// frontend/src/components/features/forecast/Forecast.jsx

import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../context/useLanguage';

function Forecast() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
        {t('forecast.placeholderText')}
        <br />
        <strong>{t('forecast.clickToExpand')}</strong>
      </p>
    </div>
  );
}

export default Forecast;
