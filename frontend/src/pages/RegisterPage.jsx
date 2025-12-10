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

function RegisterPage() {
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <AuthCard
        title="Crea tu cuenta"
        subtitle="Únete a ATMOS y sigue tu entorno con contexto."
      >
        <RegisterForm />
      </AuthCard>
    </BasePageLayout>
  );
}

export default RegisterPage;
