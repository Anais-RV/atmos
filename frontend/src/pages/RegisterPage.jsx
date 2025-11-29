// frontend/src/pages/RegisterPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import AuthCard from "../auth/AuthCard";
import RegisterForm from "../auth/RegisterForm";
import { getTemperatureColor } from "../styles/temperatureColors";


function RegisterPage() {
  return (
    <BasePageLayout title="" description="">
      <AuthCard
        title="Create your account"
        subtitle="Join ATMOS and track your environment with context."
      >
        <RegisterForm />
      </AuthCard>
    </BasePageLayout>
  );
}

export default RegisterPage;
