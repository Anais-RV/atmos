/**
 * Componente: BasePageLayout
 * Propósito: Layout base que envuelve todas las páginas de la aplicación con contenedor responsivo y color dinámico.
 * Uso:
 *  - Usado en TODAS las páginas (Dashboard, Login, Register, UserPanel, DataProtection, Forecast, ForecastExtended, ForecastChart, WeatherHistory)
 *  - Proporciona estructura común: título, descripción, contenedor con color de fondo basado en temperatura
 * Tipo:
 *  - Componente de layout global (wrapper de páginas)
 */

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

  ${MEDIA.wide} {
    max-width: 1600px;
    padding: 3rem 2.5rem;
  }

  ${MEDIA.tv} {
    max-width: 2200px;
    padding: 4rem 3rem;
  }
`;

const Dashboard = styled.section`
  background: transparent; /* Changed from rgba(15, 23, 42, 0.7) */
  backdrop-filter: none; /* Let children handle blur */
  border: none; /* Let children handle borders */
  padding: 0.5rem; /* Reduced from 1.25rem */
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Reduced from 1.5rem */
  box-sizing: border-box;
  transition: all 0.3s ease;

  ${MEDIA.tablet} {
    max-width: 900px;
    padding: 1rem;
  }

  ${MEDIA.laptop} {
    max-width: 1200px;
  }

  ${MEDIA.wide} {
    max-width: 1600px;
  }

  ${MEDIA.tv} {
    max-width: 2200px;
  }
`;


function BasePageLayout({ title, description, children }) {
  return (
    <AppMain>
      <Dashboard>
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
};

export default BasePageLayout;
