# 🌤️ WeatherInfo Component

Componente principal que muestra los datos del clima actual de una ciudad elegida. Es el corazón del dashboard.

## ✨ Características

- ✅ **Selector de ciudades** con buscador en tiempo real
- ✅ **Temperatura actual** en Celsius o Fahrenheit
- ✅ **Sensación térmica** calculada dinámicamente
- ✅ **Iconos del clima** que cambian según las condiciones
- ✅ **Diseño responsivo** para móvil, tablet y desktop
- ✅ **Animaciones suaves** para mejor UX
- ✅ **Manejo de errores** y estados de carga

## 🎯 Estructura

```
src/components/weather/
├── WeatherInfo.jsx          # Componente principal
├── CitySelector.jsx         # Selector de ciudades con búsqueda
└── ../styles/weather.css    # Estilos específicos del componente
```

## 🚀 Uso

```jsx
import WeatherInfo from '../components/weather/WeatherInfo'

function DashboardPage() {
  const [temp, setTemp] = useState(15)
  
  return (
    <section className="center-card center-card-top">
      <WeatherInfo onTemperatureChange={setTemp} />
    </section>
  )
}
```

## 📊 Props

### WeatherInfo
- `onTemperatureChange` (optional): Callback cuando cambia la temperatura para actualizar el color de fondo

### CitySelector
- `onCitySelect` (required): Callback con el city_id cuando se selecciona una ciudad

## 🔌 API Endpoints Utilizados

### GET `/api/weather/current/?city_id={id}`

**Respuesta esperada:**
```json
{
  "city_id": 1,
  "city_name": "Madrid",
  "temperature": 18.3,
  "timestamp": "2024-12-01T14:30:00Z",
  "condition": "Parcialmente nublado",
  }
```

## 🎨 Datos de Ejemplo

Los datos actualmente se obtienen de:
1. **WeatherInfo**: llamadas a la API backend
2. **CitySelector**: lista hardcodeada de ciudades (TODO: conectar a API)

### Ciudades disponibles (demo)
- Madrid
- Barcelona
- Valencia
- Sevilla
- Bilbao
- Málaga
- Alicante
- Zaragoza

## 🔄 Estados del Componente

### 1. **Initial/Placeholder**
Muestra un mensaje indicando que seleccione una ciudad

### 2. **Loading**
Muestra un spinner mientras se cargan los datos de la API

### 3. **Error**
Muestra un mensaje de error con detalles

### 4. **Success**
Muestra toda la información del clima

## 🌡️ Cálculo de Sensación Térmica

La sensación térmica se calcula usando fórmulas estándar:

- **Temperaturas bajas (< 10°C)**: Wind Chill Index
- **Temperaturas altas (> 26°C)**: Heat Index
- **Temperaturas medias**: promedio simple con efecto de humedad

## 🎭 Iconos del Clima

Usa **lucide-react** para iconos dinámicos:
- ☀️ **Sol** - Días soleados
- ☁️ **Nube** - Parcialmente nublado
- 🌧️ **Lluvia** - Lluvia
- ❄️ **Nieve** - Nieve

Los iconos tienen animaciones sutiles para mejor visualización.

## 📱 Responsive Design

- **Móvil** (< 480px): Una columna, iconos y texto adaptado
- **Tablet** (480px - 768px): Layout mixto
- **Desktop** (> 768px): Layout completo con 4 columnas de métricas

## 🎯 TODO

- [ ] Conectar selector de ciudades a API backend
- [ ] Agregar historial de ciudades visitadas
- [ ] Implementar predicción de clima (próximas horas)
- [ ] Agregar más métricas (UV index, dew point, etc.)
- [ ] Cachear datos para optimizar llamadas a API
- [ ] Agregar geolocalización automática

## 🧪 Testing

Para probar el componente:

1. **Con datos de prueba**: Selecciona una ciudad del selector
2. **Cambiar unidades**: Haz click en °C / °F para cambiar
3. **Responsivo**: Redimensiona la ventana para ver cómo se adapta
4. **Errores**: Si el backend no está disponible, verás un error

## 🔧 Desarrollo

Para modificar el componente:

1. Los estilos están en `weather.css` - totalmente separados
2. La lógica de API en `WeatherInfo.jsx`
3. El selector en `CitySelector.jsx`
4. Usa CSS Grid para adaptabilidad

## 📚 Dependencias

- `lucide-react`: Librería de iconos
- `react`: Framework UI
- Vanilla CSS: Estilos (sin librerías CSS-in-JS)
