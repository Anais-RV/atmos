/**
 * Componente: WeatherChart
 * Propósito: Visualización de series temporales del clima con Chart.js
 * Uso: Muestra gráficos de temperatura, humedad, presión, etc.
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Loader, AlertCircle } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { useLanguage } from '../../../context/useLanguage';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function WeatherChart({ cityId, variable = 'temp', timeRange = '24h' }) {
  const { t } = useLanguage()
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cityId) {
      setChartData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `/api/metrics/timeseries/?city_id=${cityId}&variable=${variable}&time_range=${timeRange}`;
        const response = await apiClient(url);

        if (response && response.data && Array.isArray(response.data)) {
          
          const labels = response.data.map(point => {
            const date = new Date(point.timestamp);
            return date.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit'
            });
          });
          
          const values = response.data.map(point => point.value);
          
          setChartData({
            labels: labels,
            datasets: [
              {
                label: getVariableLabel(variable),
                data: values,
                borderColor: getVariableColor(variable),
                backgroundColor: getVariableColor(variable, 0.1),
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
              }
            ]
          });
        } else {
          setError(t('forecast.noData'));
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityId, variable, timeRange, t]);

  const getVariableLabel = (variable) => {
    const labels = {
      temp: 'Temperatura (°C)',
      humidity: 'Humedad (%)',
      pressure: 'Presión (hPa)',
      wind_speed: 'Velocidad del viento (km/h)'
    };
    return labels[variable] || variable;
  };

  const getVariableColor = (variable, alpha = 1) => {
    const colors = {
      temp: `rgba(239, 68, 68, ${alpha})`,      // red
      humidity: `rgba(59, 130, 246, ${alpha})`,  // blue
      pressure: `rgba(168, 85, 247, ${alpha})`,  // purple
      wind_speed: `rgba(34, 197, 94, ${alpha})`  // green
    };
    return colors[variable] || `rgba(107, 114, 128, ${alpha})`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: getVariableColor(variable),
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="chart-loading">
        <Loader className="spinner" />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-error">
        <AlertCircle className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="chart-empty">
        <p>{t('dashboard.selectCity')}</p>
      </div>
    );
  }

  return (
    <div className="weather-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}

WeatherChart.propTypes = {
  cityId: PropTypes.number,
  variable: PropTypes.oneOf(['temp', 'humidity', 'pressure', 'wind_speed']),
  timeRange: PropTypes.string
};

export default WeatherChart;
