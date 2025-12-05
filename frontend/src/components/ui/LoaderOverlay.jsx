// src/components/ui/LoaderOverlay.jsx
import PropTypes from "prop-types";

function LoaderOverlay({ label = "¡ATMOS se está cargando!" }) {
  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-spinner" aria-hidden="true" />
      <p className="loader-text">{label}</p>
    </div>
  );
}

LoaderOverlay.propTypes = {
  label: PropTypes.string,
};

export default LoaderOverlay;
