// src/pages/DataProtectionPage.jsx

import { Link } from "react-router-dom";
import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import "../styles/auth.css";

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
      <section className="auth-card">
        <header className="auth-card-header">
          <h1 className="auth-card-title">Protección de datos</h1>
          <p className="auth-card-subtitle">
            Resumen de cómo usamos, almacenamos y protegemos tu información.
          </p>
        </header>

        <div className="auth-card-body">
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
        </div>
      </section>
    </BasePageLayout>
  );
}

export default DataProtectionPage;
