"""
Documentación del Endpoint de Series Temporales

DESCRIPCIÓN GENERAL
===================

El endpoint /api/metrics/timeseries/ proporciona acceso a series temporales
agregadas de datos meteorológicos (temperatura, humedad, viento, presión)
para análisis y visualización en gráficas.

Los datos se devuelven normalizados, ordenados por timestamp y pueden ser
agregados por hora o día según sea necesario.


ESPECIFICACIÓN DE API
====================

Endpoint: GET /api/metrics/timeseries/

Protocolo: HTTP/HTTPS
Método: GET
Autenticación: No requerida (permiso público)
Rate Limit: Sin límite (respetar caché)


PARÁMETROS REQUERIDOS
====================

city_id (integer, requerido)
  - ID de la ciudad
  - Rango: 1 a 2,147,483,647
  - Ejemplo: 1
  - Error si no existe: 400 Bad Request

variable (string, requerido)
  - Variable meteorológica a obtener
  - Opciones válidas:
    * temperature: temp, temperature
    * humidity: humedad, humidity
    * wind_speed: viento, wind, wind_speed
    * pressure: presión, pressure
  - Sensible a mayúsculas: No
  - Ejemplo: "temp" o "humidity"

time_range (string, requerido)
  - Rango de tiempo para los datos históricos
  - Opciones válidas:
    * Última hora: last_1h, 1h
    * Últimas 6 horas: last_6h, 6h
    * Últimas 24 horas: last_24h, 1d, 24h
    * Últimas 48 horas: last_48h, 2d, 48h
    * Últimos 7 días: 7d, last_7d
    * Últimos 30 días: 30d, last_30d
  - Sensible a mayúsculas: No
  - Ejemplo: "24h" o "7d"


PARÁMETROS OPCIONALES
====================

aggregation (string, opcional)
  - Tipo de agregación de datos
  - Opciones válidas:
    * hourly (promedio por hora): hourly, hour, h
    * daily (promedio por día): daily, day, d
    * raw (sin agregar): solo disponible para time_range < 24h
  - Por defecto: hourly (si time_range >= 24h), raw (si < 24h)
  - Sensible a mayúsculas: No
  - Ejemplo: "daily" o "hourly"


EJEMPLOS DE SOLICITUDES
=======================

1. Obtener temperatura de las últimas 24 horas con agregación horaria
   GET /api/metrics/timeseries/?city_id=1&variable=temp&time_range=24h

2. Obtener humedad de los últimos 7 días con agregación diaria
   GET /api/metrics/timeseries/?city_id=1&variable=humidity&time_range=7d&aggregation=daily

3. Obtener velocidad del viento de las últimas 48 horas sin agregar
   GET /api/metrics/timeseries/?city_id=1&variable=wind&time_range=48h&aggregation=raw

4. Obtener presión de los últimos 30 días con agregación diaria
   GET /api/metrics/timeseries/?city_id=2&variable=pressure&time_range=30d&aggregation=d


RESPUESTA (200 OK)
==================

{
  "city_id": 1,
  "city_name": "Madrid",
  "variable": "temp",
  "variable_field": "temperature",
  "unit": "°C",
  "time_range": "24h",
  "aggregation": "hourly",
  "data": [
    {
      "timestamp": "2025-12-11T00:00:00Z",
      "value": 15.5
    },
    {
      "timestamp": "2025-12-11T01:00:00Z",
      "value": 14.8
    },
    {
      "timestamp": "2025-12-11T02:00:00Z",
      "value": 14.2
    },
    ...
  ],
  "metadata": {
    "total_points": 24,
    "start_time": "2025-12-11T00:00:00Z",
    "end_time": "2025-12-12T00:00:00Z",
    "has_data": true
  }
}


DESCRIPCIÓN DE CAMPOS DE RESPUESTA
==================================

city_id (integer)
  - ID de la ciudad para la que se solicitaron los datos
  - Ejemplo: 1

city_name (string)
  - Nombre de la ciudad
  - Ejemplo: "Madrid"

variable (string)
  - Variable meteorológica solicitada (formato original)
  - Ejemplo: "temp"

variable_field (string)
  - Nombre del campo normalizado en la base de datos
  - Ejemplo: "temperature"

unit (string)
  - Unidad de medida de la variable
  - Ejemplos: "°C", "%", "km/h", "hPa"

time_range (string)
  - Rango de tiempo solicitado
  - Ejemplo: "24h"

aggregation (string)
  - Tipo de agregación aplicado a los datos
  - Valores: "raw", "hourly", "daily"
  - Ejemplo: "hourly"

data (array)
  - Array de puntos de datos temporales
  - Cada punto contiene:
    * timestamp (ISO 8601): Fecha y hora del dato
    * value (float): Valor de la variable (redondeado a 2 decimales)

metadata (object)
  - Información sobre los datos devueltos
  - total_points (integer): Número de puntos en la serie
  - start_time (ISO 8601): Timestamp del primer dato
  - end_time (ISO 8601): Timestamp del último dato
  - has_data (boolean): true si hay datos, false si no


CÓDIGOS DE RESPUESTA
===================

200 OK
  - Solicitud exitosa
  - Puede devolver data vacío si no hay observaciones disponibles

400 Bad Request
  - Parámetro requerido faltante
  - Parámetro con valor inválido
  - Ciudad no existe
  - Variable no válida
  - Rango de tiempo no válido
  - Respuesta típica:
    {
      "error": "Parámetros inválidos",
      "detail": "Variable 'invalid_var' no válida. Variables permitidas: temperature, humidity, wind_speed, pressure"
    }

500 Internal Server Error
  - Error inesperado en el servidor
  - Contactar al administrador si persiste


CARACTERÍSTICAS DE CACHÉ
=======================

- Los resultados se cachean automáticamente por 1 hora (3600 segundos)
- Cada combinación de (city_id, variable, time_range, aggregation) tiene su propia entrada en caché
- El caché se invalida cuando se agregan nuevas observaciones para una ciudad
- Para forzar actualización, esperar 1 hora o contactar al administrador


LÍMITES DE RESPUESTA
===================

- Máximo 5000 puntos de datos por solicitud
- Parámetros que generarían más puntos serán rechazados con 400 Bad Request
- Usar time_range más corto o agregation=daily para rangos amplios


NORMALIZACIÓN DE UNIDADES
=========================

Las unidades están normalizadas según el SI:

Variable          Campo                Unidad      Rango Normal
=========        =================    ========    ==============
Temperatura      temperature           °C          -50 a +50
Humedad          humidity              %           0 a 100
Velocidad Viento wind_speed            km/h        0 a 150
Presión          pressure              hPa         850 a 1050


VALIDACIONES
===========

city_id:
  - Debe ser un entero positivo
  - Debe existir en la base de datos
  - Ejemplo inválido: "abc", -1, 999999

variable:
  - No sensible a mayúsculas
  - Puede estar en español o inglés
  - Debe ser una de: temp, humidity, wind, pressure
  - Ejemplo inválido: "temperature_max", "wind_gust"

time_range:
  - No sensible a mayúsculas
  - Debe ser un rango predefinido
  - No acepta valores numéricos arbitrarios (ej. "42h")
  - Ejemplo inválido: "3d", "50h"

aggregation:
  - No sensible a mayúsculas
  - Solo válido si el time_range >= 24h (excepto 'raw')
  - Ejemplo inválido: "weekly", "monthly"


CASOS DE USO COMUNES
===================

1. Gráfica de temperatura diaria para los últimos 7 días
   GET /api/metrics/timeseries/?city_id=1&variable=temp&time_range=7d&aggregation=daily
   
   Frontend:
   - Usar timestamps en eje X (fechas)
   - Usar valores en eje Y (temperaturas)
   - Conectar puntos con línea para visualizar tendencia

2. Comparar humedad entre horas para optimizar riego
   GET /api/metrics/timeseries/?city_id=3&variable=humidity&time_range=24h&aggregation=hourly
   
   Frontend:
   - Mostrar gráfica de línea con valores cada hora
   - Permitir seleccionar rangos de confort

3. Análisis de presión mensual para predicción
   GET /api/metrics/timeseries/?city_id=2&variable=pressure&time_range=30d&aggregation=daily
   
   Frontend:
   - Buscar patrones y tendencias
   - Combinar con otras variables para análisis multivariable

4. Datos sin procesar para análisis científico
   GET /api/metrics/timeseries/?city_id=1&variable=wind&time_range=6h&aggregation=raw
   
   Frontend:
   - Exportar a CSV para análisis externo
   - Aplicar filtros estadísticos avanzados


INTEGRACIÓN CON FRONTEND
=======================

Ejemplo de fetch en JavaScript/React:

```javascript
async function getTimeSeriesData(cityId, variable, timeRange, aggregation = null) {
  const params = new URLSearchParams({
    city_id: cityId,
    variable: variable,
    time_range: timeRange,
    ...(aggregation && { aggregation })
  });
  
  const response = await fetch(`/api/metrics/timeseries/?${params}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error);
  }
  
  return response.json();
}

// Uso
try {
  const data = await getTimeSeriesData(1, 'temp', '7d', 'daily');
  console.log(data);
  // Preparar datos para gráfica
  const chartData = {
    labels: data.data.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [{
      label: `${data.variable_field} (${data.unit})`,
      data: data.data.map(d => d.value),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
} catch (error) {
  console.error('Error fetching time series:', error);
}
```


RENDIMIENTO Y OPTIMIZACIÓN
==========================

- Las consultas están optimizadas con índices en timestamp
- El caché reduce significativamente la carga en BD para consultas repetidas
- Para series muy largas (>7 días), usar aggregation=daily
- Las operaciones de agregación ocurren en memoria, no en BD (más rápido)


TROUBLESHOOTING
===============

P: ¿Por qué mi solicitud devuelve 400 Bad Request?
R: Verificar que:
   - Todos los parámetros requeridos estén presentes
   - Los nombres de parámetros sean exactos (case-sensitive en URL)
   - Los valores sean válidos (ej. city_id sea número)
   - La ciudad existe en BD

P: ¿Cómo obtengo datos más granulares?
R: Usar aggregation=raw con time_range < 24h

P: ¿Cuándo se actualiza el caché?
R: Después de 1 hora automáticamente, o cuando se agregan nuevas observaciones

P: ¿Puedo obtener datos de múltiples variables?
R: No en una sola solicitud. Hacer solicitudes separadas y combinar en frontend

P: ¿Qué pasa si no hay datos para la ciudad?
R: Se devuelve 200 OK con data=[] vacío y has_data=false
"""

# Nota: Este archivo es solo documentación. No contiene código ejecutable.
# Se proporciona como referencia para desarrolladores y usuarios de la API.
