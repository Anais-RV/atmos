// frontend/src/pages/DashboardPage.jsx

import { useState } from 'react'
import BasePageLayout from "../components/layout/BasePageLayout";
import WeatherInfo from "../components/weather/WeatherInfo";
import { getTemperatureColor } from "../styles/temperatureColors";

function DashboardPage() {
  const [temperatureC, setTemperatureC] = useState(15)
  const containerColor = getTemperatureColor(temperatureC)

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <section className="center-card center-card-top">
        <WeatherInfo onTemperatureChange={setTemperatureC} />
      </section>

      <section className="center-card center-card-bottom">
        <h2 className="center-card-title">Environmental metrics</h2>
        <p className="center-card-text">
          Placeholder for the component that will show wind, rain,
          pressure, lux, humidity and dew point.
        </p>
      </section>
    </BasePageLayout>
  );
}

export default DashboardPage;


