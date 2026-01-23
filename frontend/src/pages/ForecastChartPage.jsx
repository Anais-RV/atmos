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

import { useState } from "react";
import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useLanguage } from "../context/useLanguage";
import { useWeather } from "../context/WeatherContext";
import ForecastChart from "../components/features/forecast/ForecastChart";
import WeatherInfo from "../components/features/weather/WeatherInfo";
import "../components/features/forecast/charts.css";

function ForecastChartPage() {
  const { t } = useLanguage();
  const { selectedCity, setSelectedCity, temperatureC, setTemperatureC } = useWeather();

  return (
    <BasePageLayout
      title=""
      description=""
    >
      <section className="center-card center-card-top">
        <WeatherInfo
          onTemperatureChange={setTemperatureC}
          onCityChange={setSelectedCity}
        />
      </section>

      <section className="center-card center-card-middle" style={{ marginTop: '1rem' }}>
        <h2 className="center-card-title">{t('forecast.charts')}</h2>
        <p className="center-card-text">
          {t('forecast.chartsDescription')}
        </p>

        <div className="chart-main-viewport">
          <ForecastChart cityId={selectedCity?.id} />
        </div>
      </section>

      <section className="center-card center-card-bottom">
        <h2 className="center-card-title">{t('forecast.chartsSummary')}</h2>
        <p className="center-card-text">
          {t('forecast.byPeriod')}
        </p>

        <div className="chart-summary-grid">
          <section className="chart-summary-item">
            <h3 className="chart-summary-title">{t('forecast.chartsDay')}</h3>
          </section>
          <section className="chart-summary-item">
            <h3 className="chart-summary-title">{t('forecast.chartsWeek')}</h3>
          </section>
          <section className="chart-summary-item">
            <h3 className="chart-summary-title">{t('forecast.chartsMonth')}</h3>
          </section>
        </div>
      </section>
    </BasePageLayout>
  );
}

export default ForecastChartPage;
