# Integración con AEMET OpenData

Este proyecto incluye integración básica con la API oficial de AEMET (Agencia Estatal de Meteorología) para obtener datos meteorológicos reales de España.

## Estado Actual

🟡 **Implementación básica con datos MOCK**

Actualmente el sistema usa datos de prueba (mock) porque no hay API key configurada. Los datos son realistas pero generados aleatoriamente para demostración.

## Cómo Activar Datos Reales de AEMET

### 1. Registrarse en AEMET OpenData (GRATIS)

1. Visita: https://opendata.aemet.es/centrodedescargas/inicio
2. Haz clic en "Solicitar API Key"
3. Rellena el formulario con tu email
4. Recibirás la API key por correo electrónico

### 2. Configurar la API Key

Opción A - Variables de entorno (recomendado):
```bash
# En .env o en tu terminal
export AEMET_API_KEY="tu-api-key-aqui"
```

Opción B - Directamente en settings.py:
```python
# backend/config/settings.py
AEMET_API_KEY = "tu-api-key-aqui"
```

### 3. Implementar la Lógica Completa

La implementación actual es una base. Los estudiantes deben:

1. **Completar `get_aemet_data_by_coordinates()`** en `weather/aemet_service.py`:
   - Usar endpoint: `/api/observacion/convencional/todas`
   - Obtener lista de estaciones meteorológicas
   - Calcular distancia entre coordenadas y estaciones
   - Seleccionar la estación más cercana
   - Extraer datos (temperatura, humedad, presión, viento)

2. **Añadir más endpoints de AEMET**:
   - Predicción: `/api/prediccion/especifica/municipio/diaria/{codigo}`
   - Observaciones históricas
   - Mapas meteorológicos
   - Avisos y alertas

3. **Guardar observaciones en BD**:
   - Crear `WeatherObservation` con datos de AEMET
   - Implementar actualización periódica (cada hora)
   - Usar Celery o cron job para automatizar

4. **Mejorar caché y manejo de errores**:
   - Reintentos cuando AEMET no responde
   - Fallback a datos en caché si API falla
   - Logging detallado

## Recursos

- **Documentación oficial**: https://opendata.aemet.es/dist/index.html
- **Ejemplos de uso**: https://github.com/topics/aemet-api
- **Códigos de municipios**: https://www.aemet.es/es/eltiempo/prediccion/municipios

## Ejemplo de Respuesta AEMET

```json
{
  "idema": "3195",
  "lon": -3.683333,
  "fint": "2025-12-18T12:00:00",
  "prec": 0.0,
  "alt": 667.0,
  "vmax": 5.8,
  "vv": 2.5,
  "dv": 270,
  "lat": 40.45,
  "dmax": 290,
  "ubi": "MADRID RETIRO",
  "pres": 943.0,
  "hr": 65.0,
  "stdvv": 1.2,
  "ts": 12.4,
  "pres_nmar": 1015.3,
  "ta": 10.2,
  "tamax": 14.5,
  "tamin": 5.3,
  "vis": 10000.0
}
```

## Para los Estudiantes

Esta es una implementación mínima funcional. Vuestra tarea es:

1. ✅ Obtener API key de AEMET (5 minutos)
2. 🔨 Implementar `get_aemet_data_by_coordinates()` (2-3 horas)
3. 🔨 Añadir cálculo de distancia entre coordenadas (1 hora)
4. 🔨 Mapear campos de AEMET a vuestro modelo (30 minutos)
5. 🔨 Añadir tests para el servicio AEMET (1 hora)
6. 🚀 Implementar actualización automática de datos (avanzado)

¡Buena suerte! 🎓
