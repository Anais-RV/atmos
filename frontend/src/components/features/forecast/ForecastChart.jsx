/**
 * Componente: ForecastChart
 * Propósito: Gráficos de predicción y datos climatológicos con Chart.js.
 * Uso:
 *  - ForecastChartPage.jsx (único lugar donde se renderiza)
 * Dependencias:
 *  - charts.css
 *  - WeatherChart (visualización con Chart.js)
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import WeatherChart from './WeatherChart';

function ForecastChart({ cityId }) {
  const [selectedVariable, setSelectedVariable] = useState('temp');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const variables = [
    { value: 'temp', label: 'Temperatura' },
    { value: 'humidity', label: 'Humedad' },
    { value: 'pressure', label: 'Presión' },
    { value: 'wind_speed', label: 'Viento' }
  ];

  const timeRanges = [
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Último mes' }
  ];

  return (
    <div className="forecast-chart-wrapper">
      <div className="chart-controls">
        <div className="chart-control-group">
          <label htmlFor="variable-select">Variable:</label>
          <select
            id="variable-select"
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value)}
            className="chart-select"
          >
            {variables.map(v => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        <div className="chart-control-group">
          <label htmlFor="timerange-select">Periodo:</label>
          <select
            id="timerange-select"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="chart-select"
          >
            {timeRanges.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <WeatherChart
        cityId={cityId}
        variable={selectedVariable}
        timeRange={selectedTimeRange}
      />
    </div>
  );
}

ForecastChart.propTypes = {
  cityId: PropTypes.number
};

export default ForecastChart;
