/**
 * Página: ForecastChartPage
 * Propósito: Visualización gráfica de predicciones y series temporales meteorológicas.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - ForecastChart (gráficos de temperatura, humedad, presión, etc.)
 * Feature/dominio: forecast
 * Tipo: Página de solo lectura (visualización de gráficos)
 */

// frontend/src/pages/ForecastChartPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import ForecastChart from "../components/features/forecast/ForecastChart";
import "../components/features/forecast/charts.css";

function ForecastChartPage() {
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <section className="dashboard-center">
        <section className="center-card center-card-top">
          <h2 className="center-card-title">GRÁFICAS</h2>
          <p className="center-card-text">
            Visualiza las predicciones y series temporales generadas por ATMOS.
          </p>

          <div className="chart-main-viewport">
            <ForecastChart />
          </div>
        </section>

        <section className="center-card center-card-bottom">
          <h2 className="center-card-title">Resumen de gráficas</h2>
          <p className="center-card-text">
            Accede a las visualizaciones por periodo temporal.
          </p>

          <div className="chart-summary-grid">
            <section className="chart-summary-item">
              <h3 className="chart-summary-title">Gráficas del día</h3>
            </section>
            <section className="chart-summary-item">
              <h3 className="chart-summary-title">Gráficas de la semana</h3>
            </section>
            <section className="chart-summary-item">
              <h3 className="chart-summary-title">Gráficas del mes</h3>
            </section>
          </div>
        </section>
      </section>
    </BasePageLayout>
  );
}

export default ForecastChartPage;
