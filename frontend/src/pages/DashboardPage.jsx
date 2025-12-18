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

import { useState } from "react";
import BasePageLayout from "../components/layout/BasePageLayout";
import WeatherInfo from "../components/features/weather/WeatherInfo";
import { getTemperatureColor } from "../styles/temperatureColors";

function DashboardPage() {
  const [temperatureC, setTemperatureC] = useState(15);
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <section className="center-card center-card-top">
        <WeatherInfo onTemperatureChange={setTemperatureC} />
      </section>

      <section
        className="center-card center-card-bottom"
        aria-labelledby="env-metrics-title"
      >
        <h2 id="env-metrics-title" className="center-card-title">
          Environmental metrics
        </h2>
        <p className="center-card-text">
          Placeholder for the component that will show wind, rain, pressure,
          lux, humidity and dew point.
        </p>
      </section>
    </BasePageLayout>
  );
}

export default DashboardPage;
