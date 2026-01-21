/**
 * Página: RegisterPage
 * Propósito: Formulario de registro de nuevos usuarios en ATMOS.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - AuthCard (tarjeta contenedora de autenticación)
 *  - RegisterForm (formulario con nombre, email, password, confirmación)
 * Feature/dominio: auth
 * Tipo: Página de formulario (registro)
 */

// frontend/src/pages/RegisterPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import AuthCard from "../components/features/auth/AuthCard";
import RegisterForm from "../components/features/auth/RegisterForm";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useLanguage } from "../context/useLanguage";

function RegisterPage() {
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
        title={t('auth.createAccount')}
        subtitle={t('auth.registerDescription')}
      >
        <RegisterForm />
      </AuthCard>
    </BasePageLayout>
  );
}

export default RegisterPage;
