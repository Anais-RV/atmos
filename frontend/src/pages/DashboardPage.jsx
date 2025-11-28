// src/pages/DashboardPage.jsx

// Puntos de color según temperatura
const TEMP_COLOR_STOPS = [
  { temp: -5, color: "#0C6192" }, // -5º o menos
  { temp: 0, color: "#73B8DF" },  // 0º
  { temp: 15, color: "#1A8D42" }, // 15º
  { temp: 30, color: "#CF8B3D" }, // 30º
  { temp: 40, color: "#BB4040" }, // 40º o más
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColor(color1, color2, t) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const mix = (a, b) => Math.round(a + (b - a) * t);

  return rgbToHex({
    r: mix(c1.r, c2.r),
    g: mix(c1.g, c2.g),
    b: mix(c1.b, c2.b),
  });
}

function getTemperatureColor(tempC) {
  // Clamp a los extremos
  if (tempC <= TEMP_COLOR_STOPS[0].temp) {
    return TEMP_COLOR_STOPS[0].color;
  }
  if (tempC >= TEMP_COLOR_STOPS[TEMP_COLOR_STOPS.length - 1].temp) {
    return TEMP_COLOR_STOPS[TEMP_COLOR_STOPS.length - 1].color;
  }

  // Buscar el par de stops entre los que cae la temperatura
  for (let i = 0; i < TEMP_COLOR_STOPS.length - 1; i++) {
    const current = TEMP_COLOR_STOPS[i];
    const next = TEMP_COLOR_STOPS[i + 1];

    if (tempC >= current.temp && tempC <= next.temp) {
      const range = next.temp - current.temp;
      const t = range === 0 ? 0 : (tempC - current.temp) / range;
      return interpolateColor(current.color, next.color, t);
    }
  }

  // Fallback
  return TEMP_COLOR_STOPS[1].color;
}

function DashboardPage() {
  // TODO: esta temperatura vendrá del backend.
  const temperatureC = 12; // cambia este número para probar
  const containerColor = getTemperatureColor(temperatureC);

  return (
    <main className="app-main">
      <section
        className="dashboard"
        style={{ background: containerColor }}
      >

        {/* SECCIÓN CENTRAL VERTICAL */}
        <section className="dashboard-center">
          {/* CUADRADO SUPERIOR: TEMPERATURA Y DATOS PRINCIPALES */}
          <section className="center-card center-card-top">
            <h2 className="center-card-title">Main temperature card</h2>
            <p className="center-card-text">
              Placeholder for the main component that will show temperature,
              feels like, city name and main weather icon.
            </p>
          </section>

          {/* CUADRADO INFERIOR: MÉTRICAS AMBIENTALES */}
          <section className="center-card center-card-bottom">
            <h2 className="center-card-title">Environmental metrics</h2>
            <p className="center-card-text">
              Placeholder for the component that will show wind, rain,
              pressure, lux, humidity and dew point.
            </p>
          </section>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;
