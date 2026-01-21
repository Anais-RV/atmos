/**
 * Página: DataProtectionPage
 * Propósito: Información legal sobre protección de datos y privacidad de ATMOS.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - AuthCard (tarjeta contenedora con título y subtítulo)
 * Feature/dominio: auth
 * Tipo: Página de solo lectura (información legal)
 */

// src/pages/DataProtectionPage.jsx

import { Link } from "react-router-dom";
import BasePageLayout from "../components/layout/BasePageLayout";
import AuthCard from "../components/features/auth/AuthCard";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useLanguage } from "../context/useLanguage";

function DataProtectionPage() {
  const { t } = useLanguage();
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <AuthCard
        title={t('auth.dataProtectionTitle')}
        subtitle={t('auth.dataProtectionSubtitle')}
      >
        <div className="auth-text-block">
          <p>
            {t('auth.dataCollected')}
          </p>

          <ul className="auth-list">
            <li>{t('auth.noSelling')}</li>
            <li>
              {t('auth.passwordEncrypted')}
            </li>
            <li>
              {t('auth.deleteRequest')}
            </li>
            <li>
              {t('auth.dataRetention')}
            </li>
          </ul>

          <p>
            {t('auth.legalPlaceholder')}
          </p>
        </div>

        <div className="auth-form-footer" style={{ marginTop: "1.2rem" }}>
          <Link to="/login">
            <button type="button" className="auth-button-primary">
              {t('auth.backToLogin')}
            </button>
          </Link>
        </div>
      </AuthCard>
    </BasePageLayout>
  );
}

export default DataProtectionPage;
