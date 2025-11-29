// frontend/src/pages/DataProtectionPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import AuthCard from "../auth/AuthCard";
import { getTemperatureColor } from "../styles/temperatureColors";


function DataProtectionPage() {
  const temperatureC = 18;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <AuthCard
        title="Data protection"
        subtitle="How ATMOS handles and protects your personal data."
      >
        <div className="auth-text-block">
          <p>
            ATMOS collects only the information needed to provide the service:
            account data (email, password hash) and basic usage data
            (requests, saved locations, preferences).
          </p>

          <ul className="auth-list">
            <li>We never sell your data to third parties.</li>
            <li>Your password is stored using secure hashing.</li>
            <li>You can request deletion of your account data at any time.</li>
            <li>We only keep logs as long as necessary for security and debugging.</li>
          </ul>

          <p>
            This page is a placeholder for your real legal text. Here you will
            eventually paste the full GDPR-compliant document.
          </p>
        </div>
      </AuthCard>
    </BasePageLayout>
  );
}

export default DataProtectionPage;
