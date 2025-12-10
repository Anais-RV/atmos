/**
 * Componente: DataProtectionNotice
 * Propósito: Aviso legal breve sobre protección de datos con enlace a la página completa de información legal.
 * Uso:
 *  - LoginPage.jsx (mostrado debajo del formulario de login)
 * Dependencias:
 *  - auth.css (.auth-data-notice, .auth-data-text, .auth-link)
 */

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
