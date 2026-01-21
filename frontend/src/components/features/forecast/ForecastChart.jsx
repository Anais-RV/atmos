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
import { useLanguage } from '../../../context/useLanguage';
import WeatherChart from './WeatherChart';

function ForecastChart({ cityId }) {
  const [selectedVariable, setSelectedVariable] = useState('temp');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const { t } = useLanguage();

  const variables = [
    { value: 'temp', label: t('forecast.temperature') },
    { value: 'humidity', label: t('forecast.humidity') },
    { value: 'pressure', label: t('forecast.pressure') },
    { value: 'wind_speed', label: t('forecast.wind') }
  ];

  const timeRanges = [
    { value: '24h', label: t('forecast.last24h') },
    { value: '7d', label: t('forecast.last7days') },
    { value: '30d', label: t('forecast.lastMonth') }
  ];

  return (
    <div className="forecast-chart-wrapper">
      <div className="chart-controls">
        <div className="chart-control-group">
          <label htmlFor="variable-select">{t('forecast.variable')}:</label>
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
          <label htmlFor="timerange-select">{t('forecast.period')}:</label>
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
