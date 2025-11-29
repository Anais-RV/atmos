// frontend/src/components/layout/BasePageLayout.jsx
import styled from "styled-components";
import { MEDIA } from "../../styles/breakpoints";


const AppMain = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  ${MEDIA.tablet} {
    max-width: 960px;
    padding: 2rem 1.5rem;
  }

  ${MEDIA.laptop} {
    max-width: 1120px;
    padding: 2.5rem 2rem;
  }
`;

const Dashboard = styled.section`
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid #1e293b;
  border-radius: 1.25rem;
  padding: 1rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.9);
  max-width: 460px;
  margin: 0 auto;
`;

function BasePageLayout({ title, description, children }) {
  return (
    <AppMain>
      <Dashboard>
        <header className="dashboard-header">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </header>

        <section className="dashboard-center">{children}</section>
      </Dashboard>
    </AppMain>
  );
}

export default BasePageLayout;
