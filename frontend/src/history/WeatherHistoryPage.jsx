// frontend/src/history/WeatherHistoryPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import WeatherHistory from "./WeatherHistory";
import "../styles/history.css";

function WeatherHistoryPage() {
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
          <h2 className="center-card-title">WEATHER HISTORY</h2>
          <p className="center-card-text">
            Consulta el historial meteorológico registrado por ATMOS.
          </p>

          {/* Zona donde irán las gráficas de historial */}
          <div className="history-main-viewport">
            <WeatherHistory />
          </div>
        </section>

        {/* Tarjeta inferior */}
        <section className="center-card center-card-bottom">
          <h2 className="center-card-title">History summary</h2>
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
