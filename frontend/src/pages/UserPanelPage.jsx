// frontend/src/pages/UserPanelPage.jsx

import BasePageLayout from "../components/layout/BasePageLayout";
import AuthCard from "../auth/AuthCard";
import UserPanelInfo from "../auth/UserPanelInfo";
import { getTemperatureColor } from "../styles/temperatureColors";


function UserPanelPage() {
  const temperatureC = 18;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <AuthCard
        title="User panel"
        subtitle="Manage your profile and personal ATMOS settings."
      >
        <UserPanelInfo />
      </AuthCard>
    </BasePageLayout>
  );
}

export default UserPanelPage;
