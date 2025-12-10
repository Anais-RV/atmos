/**
 * Página: DataProtectionPage
 * Propósito: Información legal sobre protección de datos y privacidad de ATMOS.
 * Componentes principales:
 *  - BasePageLayout (layout general)
 *  - AuthCard (tarjeta contenedora con título y subtítulo)
 * Feature/dominio: auth
 * Tipo: Página de solo lectura (información legal)
 */

// src/pages/DataProtectionPage.jsx

import { Link } from "react-router-dom";
import BasePageLayout from "../components/layout/BasePageLayout";
import AuthCard from "../components/features/auth/AuthCard";
import { getTemperatureColor } from "../styles/temperatureColors";

function DataProtectionPage() {
  // Misma lógica de contenedor que en LoginPage / DashboardPage
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <BasePageLayout
      title=""
      description=""
      containerColor={containerColor}
    >
      <AuthCard
        title="Protección de datos"
        subtitle="Resumen de cómo usamos, almacenamos y protegemos tu información."
      >
        <div className="auth-text-block">
          <p>
            ATMOS recopila únicamente la información necesaria para ofrecerte el
            servicio: datos de cuenta (correo electrónico, contraseña cifrada) y
            datos básicos de uso (consultas realizadas, ubicaciones guardadas,
            preferencias).
          </p>

          <ul className="auth-list">
            <li>Nunca vendemos tus datos a terceros.</li>
            <li>
              Tu contraseña se almacena utilizando técnicas de cifrado y hash seguras.
            </li>
            <li>
              Puedes solicitar la eliminación de tu cuenta y de tus datos en
              cualquier momento.
            </li>
            <li>
              Solo conservamos los registros el tiempo necesario para garantizar
              la seguridad y depurar posibles errores.
            </li>
          </ul>

          <p>
            Esta página es un marcador de posición para tu texto legal real. Aquí,
            más adelante, pegarás el documento completo adaptado al RGPD y a la
            normativa vigente.
          </p>
        </div>

        <div className="auth-form-footer" style={{ marginTop: "1.2rem" }}>
          <Link to="/login">
            <button type="button" className="auth-button-primary">
              Volver al inicio de sesión
            </button>
          </Link>
        </div>
      </AuthCard>
    </BasePageLayout>
  );
}

export default DataProtectionPage;
