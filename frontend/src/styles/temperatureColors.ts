// frontend/src/styles/temperatureColors.ts

export type TemperatureColorStop = {
  temp: number;
  color: string; // hex tipo "#RRGGBB"
};

export const TEMP_COLOR_STOPS: TemperatureColorStop[] = [
  { temp: -5, color: "#0C6192" }, // -5º o menos
  { temp: 0,  color: "#73B8DF" }, // 0º
  { temp: 15, color: "#1A8D42" }, // 15º
  { temp: 30, color: "#CF8B3D" }, // 30º
  { temp: 40, color: "#BB4040" }, // 40º o más
];

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColor(color1: string, color2: string, t: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);

  return rgbToHex({
    r: mix(c1.r, c2.r),
    g: mix(c1.g, c2.g),
    b: mix(c1.b, c2.b),
  });
}

export function getTemperatureColor(tempC: number): string {
  if (tempC <= TEMP_COLOR_STOPS[0].temp) {
    return TEMP_COLOR_STOPS[0].color;
  }
  if (tempC >= TEMP_COLOR_STOPS[TEMP_COLOR_STOPS.length - 1].temp) {
    return TEMP_COLOR_STOPS[TEMP_COLOR_STOPS.length - 1].color;
  }

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
