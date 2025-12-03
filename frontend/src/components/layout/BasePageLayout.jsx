// frontend/src/components/layout/BasePageLayout.jsx
import PropTypes from 'prop-types';
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
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  min-height: 360px; /* alto base en móvil */

  ${MEDIA.tablet} {
    max-width: 720px;   /* más ancho en tablet */
    padding: 1.25rem 1.5rem;
    min-height: 420px;  /* un poco más alto */
  }

  ${MEDIA.laptop} {
    max-width: 960px;   /* más ancho en portátil/escritorio */
    padding: 1.5rem 2rem;
    min-height: 480px;  /* más alto aún */
  }
`;


function BasePageLayout({ title, description, children, containerColor }) {
  return (
    <AppMain>
      <Dashboard
        style={containerColor ? { background: containerColor } : undefined}
      >
        {(title || description) && (
          <header className="dashboard-header">
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
          </header>
        )}

        <section className="dashboard-center">{children}</section>
      </Dashboard>
    </AppMain>
  );
}

BasePageLayout.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  containerColor: PropTypes.string,
};

export default BasePageLayout;
