import BasePageLayout from '../components/layout/BasePageLayout';
import SettingsForm from '../components/features/settings/SettingsForm';
import { getTemperatureColor } from '../styles/temperatureColors';
import { useState, useEffect } from 'react';

function SettingsPage() {
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar ciudades disponibles
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/weather/cities/');
        if (response.ok) {
          const data = await response.json();
          setCities(data.results || data);
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <BasePageLayout
      title="Configuración"
      description="Personaliza tu experiencia en ATMOS"
      containerColor={containerColor}
    >
      <section className="settings-page">
        <div className="settings-container">
          <header className="settings-header">
            <h1 className="settings-title">Configuración</h1>
            <p className="settings-subtitle">
              Personaliza tu experiencia en ATMOS ajustando tus preferencias
            </p>
          </header>

          {loading ? (
            <div className="settings-loading-container">
              <p>Cargando ciudades...</p>
            </div>
          ) : (
            <SettingsForm cities={cities} />
          )}
        </div>
      </section>
    </BasePageLayout>
  );
}

export default SettingsPage;
