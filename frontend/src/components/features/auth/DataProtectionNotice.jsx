/**
 * Componente: DataProtectionNotice
 * Propósito: Aviso legal breve sobre protección de datos con enlace a la página completa de información legal.
 * Uso:
 *  - LoginPage.jsx (mostrado debajo del formulario de login)
 * Dependencias:
 *  - auth.css (.auth-data-notice, .auth-data-text, .auth-link)
 */

import { useLanguage } from '../../../context/useLanguage'

function DataProtectionNotice() {
  const { t } = useLanguage()

  return (
    <div className="auth-data-notice">
      <p className="auth-data-text">
        {t('dataProtection.notice')}{" "}
        <a href="/data-protection" className="auth-link">
          {t('dataProtection.policy')}
        </a>.
      </p>
    </div>
  );
}

export default DataProtectionNotice;
