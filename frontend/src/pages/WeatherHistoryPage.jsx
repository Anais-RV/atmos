/**
 * Página: WeatherHistoryPage
 * Propósito: Consulta del historial meteorológico registrado por ATMOS.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - WeatherHistory (tabla/lista con datos históricos de temperatura, humedad, etc.)
 * Feature/dominio: history / weather
 * Tipo: Página de solo lectura (visualización de histórico)
 */

// frontend/src/pages/WeatherHistoryPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import WeatherHistory from "../components/features/history/WeatherHistory";
import { useLanguage } from "../context/useLanguage";
import "../components/features/history/history.css";

function WeatherHistoryPage() {
  const { t } = useLanguage();
  const temperatureC = 7; // igual que Dashboard/Charts para mantener coherencia
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
          <h2 className="center-card-title">{t('weatherHistory.title')}</h2>
          <p className="center-card-text">
            {t('weatherHistory.noAlerts')}
          </p>

          {/* Zona donde irán las gráficas de historial */}
          <div className="history-main-viewport">
            <WeatherHistory />
          </div>
        </section>

        {/* Tarjeta inferior */}
        <section className="center-card center-card-bottom">
          <h2 className="center-card-title">{t('weatherHistory.alertsSummary')}</h2>
          <p className="center-card-text">
            Mostrará max/min del día anterior
          </p>

          <div className="history-summary-grid">

          </div>
        </section>
      </section>
    </BasePageLayout>
  );
}

export default WeatherHistoryPage;
