import BasePageLayout from '../components/layout/BasePageLayout';
import SettingsForm from '../components/features/settings/SettingsForm';
import { getTemperatureColor } from '../styles/temperatureColors';
import { useState, useEffect } from 'react';
import { useLanguage } from "../context/useLanguage";
import apiClient from '../services/apiClient';

function SettingsPage() {
  const { t } = useLanguage();
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar ciudades disponibles
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await apiClient('/api/weather/cities/');
        setCities(data.results || data);
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
      title={t('settings.title')}
      description={t('settings.selectLanguage')}
      containerColor={containerColor}
    >
      <section className="settings-page">
        <div className="settings-container">
          <header className="settings-header">
            <h1 className="settings-title">{t('settings.title')}</h1>
            <p className="settings-subtitle">
              {t('settings.appearance')}
            </p>
          </header>

          {loading ? (
            <div className="settings-loading-container">
              <p>{t('common.loading')}</p>
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
