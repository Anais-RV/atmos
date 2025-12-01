// src/auth/DataProtectionNotice.jsx

function DataProtectionNotice() {
  return (
    <div className="auth-data-notice">
      <p className="auth-data-text">
        Usamos tus datos únicamente para poder ofrecerte el servicio de ATMOS. Puedes leer más detalles en nuestra{" "}
        <a href="/data-protection" className="auth-link">
          política de protección de datos
        </a>.
      </p>
    </div>
  );
}

export default DataProtectionNotice;
