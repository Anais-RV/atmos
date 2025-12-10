/**
 * Página: ForecastExtendedPage
 * Propósito: Vista ampliada de la predicción meteorológica con más detalles y rango temporal extendido.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 * Feature/dominio: forecast
 * Tipo: Página de solo lectura (visualización extendida de predicciones)
 */

// frontend/src/pages/ForecastExtendedPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import "../components/features/forecast/forecast.css";

function ForecastExtendedPage() {
  const temperatureC = 7; // mismo criterio que ForecastPage
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <section className="dashboard-center">
        {/* Solo una card, más alta que las de ForecastPage */}
        <section className="center-card forecast-extended-card">
          <h2 className="center-card-title">FORECAST EXTENDIDO</h2>
          <p className="center-card-text">
            Vista ampliada de la predicción meteorológica.
          </p>

          <div className="forecast-main-viewport">
            <p className="forecast-placeholder-text">
              Aquí irá la versión extendida: más gráficas, más detalles, etc.
            </p>
          </div>
        </section>
      </section>
    </BasePageLayout>
  );
}

export default ForecastExtendedPage;
