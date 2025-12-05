// frontend/src/pages/DashboardPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";

function DashboardPage() {
  // TODO: esta temperatura vendrá del backend
  const temperatureC = 7; // cambia este valor para probar (-5, 0, 10, 25, 35...)
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <section className="center-card center-card-top" aria-labelledby="main-temp-title">
        <h2 id="main-temp-title" className="center-card-title">Main temperature card</h2>
        <p className="center-card-text">
          Placeholder for the main component that will show temperature,
          feels like, city name and main weather icon.
        </p>
      </section>

      <section className="center-card center-card-bottom" aria-labelledby="env-metrics-title">
        <h2 id="env-metrics-title" className="center-card-title">Environmental metrics</h2>
        <p className="center-card-text">
          Placeholder for the component that will show wind, rain,
          pressure, lux, humidity and dew point.
        </p>
      </section>
    </BasePageLayout>
  );
}

export default DashboardPage;
