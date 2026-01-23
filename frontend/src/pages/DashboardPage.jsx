/**
 * Página: DashboardPage
 * Propósito: Dashboard principal que muestra el resumen general del tiempo actual y métricas ambientales.
 * Componentes principales:
 *  - BasePageLayout (layout general con navbar y footer)
 *  - WeatherInfo (datos meteorológicos actuales de la ciudad seleccionada)
 * Feature/dominio: weather
 * Tipo: Página de solo lectura con selector de ciudad
 */

// frontend/src/pages/DashboardPage.jsx

import { useState, useEffect } from "react";
import BasePageLayout from "../components/layout/BasePageLayout";
import WeatherInfo from "../components/features/weather/WeatherInfo";
import SunriseSunset from "../components/features/weather/sunrise/SunriseSunset";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useLanguage } from "../context/useLanguage";
import { useWeather } from "../context/WeatherContext";

function DashboardPage() {
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

      <section className="center-card center-card-bottom">
        <SunriseSunset city={selectedCity} />
      </section>

      <section
        className="center-card center-card-bottom"
        aria-labelledby="env-metrics-title"
      >
        <h2 id="env-metrics-title" className="center-card-title">
          {t('dashboard.environmentalMetrics')}
        </h2>
        <p className="center-card-text">
          {t('dashboard.metricsPlaceholder')}
        </p>
      </section>
    </BasePageLayout>
  );
}

export default DashboardPage;
