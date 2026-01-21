/**
 * Página: ForecastPage
 * Propósito: Vista de predicción meteorológica generada por el modelo Prophet.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - Forecast (tabla/lista con predicción de temperatura, humedad, etc.)
 * Feature/dominio: forecast
 * Tipo: Página de solo lectura (visualización de predicciones)
 */

// frontend/src/pages/ForecastPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useLanguage } from "../context/useLanguage";
import Forecast from "../components/features/forecast/Forecast";
import "../components/features/forecast/forecast.css";

function ForecastPage() {
  const { t } = useLanguage();
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      {/* MISMO LAYOUT QUE DASHBOARD (dos center-card) */}
      <section className="dashboard-center">
        {/* Tarjeta superior */}
        <section className="center-card center-card-top">
          <h2 className="center-card-title">{t('forecast.title')}</h2>
          <p className="center-card-text">
            {t('forecast.nextDaysForecasts')}
          </p>

          {/* Zona donde irán las gráficas de predicción */}
          <div className="forecast-main-viewport">
            <Forecast />
          </div>
        </section>

        {/* Tarjeta inferior */}
        <section className="center-card center-card-bottom">
          <h2 className="center-card-title">{t('forecast.forecastSummary')}</h2>
          <p className="center-card-text">
            {t('forecast.nextDaysForecasts')}
          </p>

          <div className="forecast-summary-grid">
            {/* Aquí irán las tarjetas de resumen de la predicción */}
          </div>
        </section>
      </section>
    </BasePageLayout>
  );
}

export default ForecastPage;
