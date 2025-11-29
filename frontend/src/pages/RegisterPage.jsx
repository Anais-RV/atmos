// frontend/src/pages/RegisterPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import AuthCard from "../auth/AuthCard";
import RegisterForm from "../auth/RegisterForm";
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
