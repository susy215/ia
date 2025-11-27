# 🌾 Smart Farming API - Documentación para Frontend

## 📋 Índice
- [Descripción General](#descripción-general)
- [Endpoints Disponibles](#endpoints-disponibles)
- [API 1: Generar Recomendación de Siembra](#api-1-generar-recomendación-de-siembra)
- [API 2: Generar Plan de Fertilización](#api-2-generar-plan-de-fertilización)
- [API 3: Generar Estimación de Cosecha](#api-3-generar-estimación-de-cosecha)
- [Ejemplos de Integración React](#ejemplos-de-integración-react)
- [Manejo de Errores](#manejo-de-errores)

---

## 📖 Descripción General

Las APIs de Smart Farming utilizan inteligencia artificial para generar recomendaciones agrícolas basadas en datos de parcelas y cultivos. Todas las APIs utilizan el método **POST** y retornan datos en formato JSON.

**Base URL:** `http://localhost:8000`

---

## 🔗 Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/smart-farming/ia/recomendacion/generar/` | POST | Genera recomendación de siembra para una parcela |
| `/api/smart-farming/ia/fertilizacion/generar/` | POST | Genera plan de fertilización para un cultivo |
| `/api/smart-farming/ia/cosecha/generar/` | POST | Genera estimación de cosecha para un cultivo |

---

## API 1: Generar Recomendación de Siembra

### 🎯 Propósito
Genera una recomendación inteligente sobre qué especie sembrar en una parcela específica, basándose en las características del suelo (tipo, pH, hectáreas).

### 📍 Endpoint
```
POST /api/smart-farming/ia/recomendacion/generar/
```

### 📤 Request Body

```json
{
  "parcela_id": 1
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `parcela_id` | integer | ✅ Sí | ID de la parcela para la cual generar la recomendación |

### 📥 Response (201 Created)

```json
{
  "id": 1,
  "parcela": 1,
  "especie_sugerida": "Tomate",
  "confianza_ia": 85,
  "rentabilidad_estimada": "45000.00",
  "justificacion_texto": "El suelo Franco con pH 6.5 es ideal para tomate. Rentabilidad alta en esta región.",
  "fecha_generacion": "2025-11-26T12:30:00Z"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID único de la recomendación generada |
| `parcela` | integer | ID de la parcela |
| `especie_sugerida` | string | Nombre de la especie recomendada (ej: "Tomate", "Maíz") |
| `confianza_ia` | integer | Nivel de confianza de la IA (0-100%) |
| `rentabilidad_estimada` | decimal | Rentabilidad estimada en moneda local |
| `justificacion_texto` | string | Explicación detallada de por qué se recomienda esta especie |
| `fecha_generacion` | datetime | Fecha y hora de generación |

### 🎨 Componente UI Sugerido

**Vista:** Tarjeta o Modal de Recomendación
- **Título:** "Recomendación de Siembra"
- **Elementos visuales:**
  - Badge con nivel de confianza (color verde si >70%, amarillo 40-70%, rojo <40%)
  - Icono de la especie sugerida
  - Gráfico de barras o medidor de rentabilidad
  - Área de texto para justificación

**Botón de acción:**
```jsx
<button onClick={handleGenerarRecomendacion}>
  🌱 Generar Recomendación IA
</button>
```

---

## API 2: Generar Plan de Fertilización

### 🎯 Propósito
Genera un plan detallado de fertilización para un cultivo activo, incluyendo fechas de aplicación, dosis y costos estimados.

### 📍 Endpoint
```
POST /api/smart-farming/ia/fertilizacion/generar/
```

### 📤 Request Body

```json
{
  "cultivo_id": 1
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `cultivo_id` | integer | ✅ Sí | ID del cultivo para el cual generar el plan |

### 📥 Response (201 Created)

```json
{
  "id": 1,
  "cultivo": 1,
  "fecha_generacion": "2025-11-26T12:30:00Z",
  "costo_total": "2500.00",
  "detalle_aplicaciones": [
    {
      "etapa": "Preparación de Suelo",
      "producto": "Cal Agrícola",
      "dosis": "2000 kg/ha",
      "fecha_sugerida": "2025-10-15",
      "notas": "Incorporar con arado para corregir acidez."
    },
    {
      "etapa": "Siembra",
      "producto": "NPK 15-15-15 (Fórmula Completa)",
      "dosis": "300 kg/ha",
      "fecha_sugerida": "2025-11-14",
      "notas": "Aplicar al fondo del surco."
    },
    {
      "etapa": "Crecimiento Vegetativo",
      "producto": "Urea (46% N)",
      "dosis": "200 kg/ha",
      "fecha_sugerida": "2025-12-29",
      "notas": "Aplicar en banda lateral y regar inmediatamente."
    }
  ]
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID único del plan de fertilización |
| `cultivo` | integer | ID del cultivo |
| `fecha_generacion` | datetime | Fecha y hora de generación |
| `costo_total` | decimal | Costo total estimado del plan |
| `detalle_aplicaciones` | array | Lista de aplicaciones programadas |
| `detalle_aplicaciones[].etapa` | string | Etapa fenológica del cultivo |
| `detalle_aplicaciones[].producto` | string | Nombre del producto/fertilizante |
| `detalle_aplicaciones[].dosis` | string | Dosis completa (incluye unidades) |
| `detalle_aplicaciones[].fecha_sugerida` | string | Fecha sugerida de aplicación (YYYY-MM-DD) |
| `detalle_aplicaciones[].notas` | string | Instrucciones adicionales de aplicación |

### 🎨 Componente UI Sugerido

**Vista:** Timeline o Calendario de Aplicaciones
- **Título:** "Plan de Fertilización IA"
- **Elementos visuales:**
  - Timeline vertical con fechas
  - Tarjetas para cada aplicación mostrando:
    - Fecha
    - Tipo de fertilizante
    - Dosis
    - Costo individual
  - Total destacado al final
  - Opción de exportar a PDF/calendario

**Botón de acción:**
```jsx
<button onClick={handleGenerarPlanFertilizacion}>
  🧪 Generar Plan de Fertilización
</button>
```

---

## API 3: Generar Estimación de Cosecha

### 🎯 Propósito
Estima la fecha óptima de cosecha, precio proyectado del mercado y riesgos climáticos para un cultivo.

### 📍 Endpoint
```
POST /api/smart-farming/ia/cosecha/generar/
```

### 📤 Request Body

```json
{
  "cultivo_id": 1
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `cultivo_id` | integer | ✅ Sí | ID del cultivo para el cual generar la estimación |

### 📥 Response (201 Created)

```json
{
  "id": 1,
  "cultivo": 1,
  "fecha_optima": "2026-03-15",
  "ventana_dias": 7,
  "precio_mercado_proyectado": "3500.00",
  "riesgo_clima": "MEDIO",
  "accion_recomendada": "Monitorear clima. Considerar cosecha anticipada si hay pronóstico de lluvias.",
  "fecha_generacion": "2025-11-26T12:30:00Z"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID único de la estimación |
| `cultivo` | integer | ID del cultivo |
| `fecha_optima` | date | Fecha óptima recomendada para cosechar (YYYY-MM-DD) |
| `ventana_dias` | integer | Ventana de días óptimos (ej: 7 = puede cosechar ±7 días) |
| `precio_mercado_proyectado` | decimal | Precio proyectado por tonelada/kg |
| `riesgo_clima` | string | Nivel de riesgo: `"BAJO"`, `"MEDIO"`, `"ALTO"` |
| `accion_recomendada` | string | Texto con la acción recomendada |
| `fecha_generacion` | datetime | Fecha y hora de generación |

### 🎨 Componente UI Sugerido

**Vista:** Dashboard de Cosecha
- **Título:** "Estimación de Cosecha IA"
- **Elementos visuales:**
  - Calendario destacando fecha óptima y ventana
  - Badge de riesgo climático (verde=BAJO, amarillo=MEDIO, rojo=ALTO)
  - Gráfico de precio proyectado
  - Alert/Banner con acción recomendada
  - Contador de días hasta cosecha

**Botón de acción:**
```jsx
<button onClick={handleGenerarEstimacionCosecha}>
  📊 Generar Estimación de Cosecha
</button>
```

---

## 💻 Ejemplos de Integración React

### Configuración Base (Axios)

```javascript
// src/api/smartFarming.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/smart-farming/ia';

export const smartFarmingAPI = {
  generarRecomendacion: async (parcelaId) => {
    const response = await axios.post(
      `${API_BASE_URL}/recomendacion/generar/`,
      { parcela_id: parcelaId }
    );
    return response.data;
  },

  generarFertilizacion: async (cultivoId) => {
    const response = await axios.post(
      `${API_BASE_URL}/fertilizacion/generar/`,
      { cultivo_id: cultivoId }
    );
    return response.data;
  },

  generarCosecha: async (cultivoId) => {
    const response = await axios.post(
      `${API_BASE_URL}/cosecha/generar/`,
      { cultivo_id: cultivoId }
    );
    return response.data;
  }
};
```

### Ejemplo 1: Componente de Recomendación

```jsx
// src/components/RecomendacionSiembra.jsx
import React, { useState } from 'react';
import { smartFarmingAPI } from '../api/smartFarming';

const RecomendacionSiembra = ({ parcelaId }) => {
  const [loading, setLoading] = useState(false);
  const [recomendacion, setRecomendacion] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await smartFarmingAPI.generarRecomendacion(parcelaId);
      setRecomendacion(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al generar recomendación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recomendacion-card">
      <h2>Recomendación de Siembra IA</h2>
      
      <button 
        onClick={handleGenerar} 
        disabled={loading}
        className="btn-primary"
      >
        {loading ? '⏳ Generando...' : '🌱 Generar Recomendación'}
      </button>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {recomendacion && (
        <div className="resultado">
          <div className="header">
            <h3>{recomendacion.especie_sugerida}</h3>
            <span className={`badge ${getConfianzaClass(recomendacion.confianza_ia)}`}>
              {recomendacion.confianza_ia}% confianza
            </span>
          </div>
          
          <div className="rentabilidad">
            <strong>Rentabilidad estimada:</strong> 
            ${parseFloat(recomendacion.rentabilidad_estimada).toLocaleString()}
          </div>
          
          <div className="justificacion">
            <p>{recomendacion.justificacion_texto}</p>
          </div>
          
          <small>Generado: {new Date(recomendacion.fecha_generacion).toLocaleString()}</small>
        </div>
      )}
    </div>
  );
};

const getConfianzaClass = (confianza) => {
  if (confianza >= 70) return 'success';
  if (confianza >= 40) return 'warning';
  return 'danger';
};

export default RecomendacionSiembra;
```

### Ejemplo 2: Componente de Plan de Fertilización

```jsx
// src/components/PlanFertilizacion.jsx
import React, { useState } from 'react';
import { smartFarmingAPI } from '../api/smartFarming';

const PlanFertilizacion = ({ cultivoId }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await smartFarmingAPI.generarFertilizacion(cultivoId);
      setPlan(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al generar plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-fertilizacion">
      <h2>Plan de Fertilización IA</h2>
      
      <button 
        onClick={handleGenerar} 
        disabled={loading}
        className="btn-primary"
      >
        {loading ? '⏳ Generando...' : '🧪 Generar Plan'}
      </button>

      {error && <div className="alert alert-error">{error}</div>}

      {plan && (
        <div className="resultado">
          <div className="costo-total">
            <h3>Costo Total: ${parseFloat(plan.costo_total).toLocaleString()}</h3>
          </div>

          <div className="timeline">
            {plan.detalle_aplicaciones.map((app, index) => (
              <div key={index} className="aplicacion-card">
                <div className="fecha">{app.fecha}</div>
                <div className="detalles">
                  <strong>{app.tipo_fertilizante}</strong>
                  <p>Dosis: {app.dosis_kg_ha} kg/ha</p>
                  <p>Costo: ${app.costo.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanFertilizacion;
```

### Ejemplo 3: Componente de Estimación de Cosecha

```jsx
// src/components/EstimacionCosecha.jsx
import React, { useState } from 'react';
import { smartFarmingAPI } from '../api/smartFarming';

const EstimacionCosecha = ({ cultivoId }) => {
  const [loading, setLoading] = useState(false);
  const [estimacion, setEstimacion] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await smartFarmingAPI.generarCosecha(cultivoId);
      setEstimacion(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al generar estimación');
    } finally {
      setLoading(false);
    }
  };

  const getRiesgoColor = (riesgo) => {
    const colors = {
      'BAJO': 'green',
      'MEDIO': 'yellow',
      'ALTO': 'red'
    };
    return colors[riesgo] || 'gray';
  };

  return (
    <div className="estimacion-cosecha">
      <h2>Estimación de Cosecha IA</h2>
      
      <button 
        onClick={handleGenerar} 
        disabled={loading}
        className="btn-primary"
      >
        {loading ? '⏳ Generando...' : '📊 Generar Estimación'}
      </button>

      {error && <div className="alert alert-error">{error}</div>}

      {estimacion && (
        <div className="resultado">
          <div className="fecha-optima">
            <h3>Fecha Óptima de Cosecha</h3>
            <div className="fecha">{estimacion.fecha_optima}</div>
            <small>Ventana: ±{estimacion.ventana_dias} días</small>
          </div>

          <div className="precio">
            <strong>Precio Proyectado:</strong> 
            ${parseFloat(estimacion.precio_mercado_proyectado).toLocaleString()}
          </div>

          <div className="riesgo">
            <span 
              className="badge" 
              style={{ backgroundColor: getRiesgoColor(estimacion.riesgo_clima) }}
            >
              Riesgo Climático: {estimacion.riesgo_clima}
            </span>
          </div>

          <div className="accion-recomendada">
            <h4>⚠️ Acción Recomendada</h4>
            <p>{estimacion.accion_recomendada}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimacionCosecha;
```

### Ejemplo con React Hooks Personalizados

```javascript
// src/hooks/useSmartFarming.js
import { useState } from 'react';
import { smartFarmingAPI } from '../api/smartFarming';

export const useRecomendacion = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const generar = async (parcelaId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await smartFarmingAPI.generarRecomendacion(parcelaId);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generar, loading, data, error };
};

export const useFertilizacion = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const generar = async (cultivoId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await smartFarmingAPI.generarFertilizacion(cultivoId);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generar, loading, data, error };
};

export const useCosecha = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const generar = async (cultivoId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await smartFarmingAPI.generarCosecha(cultivoId);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generar, loading, data, error };
};
```

**Uso del hook:**

```jsx
import { useRecomendacion } from '../hooks/useSmartFarming';

const MiComponente = ({ parcelaId }) => {
  const { generar, loading, data, error } = useRecomendacion();

  return (
    <button onClick={() => generar(parcelaId)} disabled={loading}>
      Generar
    </button>
  );
};
```

---

## ⚠️ Manejo de Errores

### Errores Comunes

| Código HTTP | Descripción | Causa |
|-------------|-------------|-------|
| 400 | Bad Request | Falta el campo requerido (`parcela_id` o `cultivo_id`) |
| 404 | Not Found | La parcela o cultivo con ese ID no existe |
| 500 | Internal Server Error | Error en el servidor |

### Ejemplo de Respuesta de Error

```json
{
  "detail": "No Parcela matches the given query."
}
```

### Manejo en Frontend

```javascript
try {
  const data = await smartFarmingAPI.generarRecomendacion(parcelaId);
  // Éxito
} catch (error) {
  if (error.response) {
    // El servidor respondió con un código de error
    switch (error.response.status) {
      case 400:
        alert('Datos inválidos. Verifica el ID de la parcela.');
        break;
      case 404:
        alert('Parcela no encontrada.');
        break;
      case 500:
        alert('Error del servidor. Intenta más tarde.');
        break;
      default:
        alert('Error desconocido.');
    }
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    alert('No se pudo conectar con el servidor.');
  } else {
    // Algo más salió mal
    alert('Error: ' + error.message);
  }
}
```

---

## 🎨 Sugerencias de UX/UI

### Flujo de Usuario Recomendado

1. **Recomendación de Siembra:**
   - Usuario selecciona una parcela desde un dropdown o mapa
   - Click en "Generar Recomendación"
   - Mostrar loading spinner
   - Mostrar resultado en modal o tarjeta expandible
   - Opción de guardar/exportar

2. **Plan de Fertilización:**
   - Usuario selecciona un cultivo activo
   - Click en "Generar Plan"
   - Mostrar timeline animado
   - Permitir agregar al calendario
   - Opción de imprimir/exportar PDF

3. **Estimación de Cosecha:**
   - Usuario selecciona cultivo próximo a cosechar
   - Click en "Generar Estimación"
   - Mostrar dashboard con métricas clave
   - Alertas visuales según riesgo climático
   - Opción de configurar recordatorios

### Elementos Visuales Sugeridos

- **Iconos:** 🌱 (siembra), 🧪 (fertilización), 📊 (cosecha)
- **Colores:**
  - Verde: Confianza alta, riesgo bajo
  - Amarillo: Confianza media, riesgo medio
  - Rojo: Confianza baja, riesgo alto
- **Animaciones:** Loading spinners, transiciones suaves al mostrar resultados
- **Gráficos:** Chart.js o Recharts para visualizar datos

---

## 📝 Notas Adicionales

- Todas las APIs retornan **201 Created** en caso de éxito
- Los IDs (`parcela_id`, `cultivo_id`) deben existir en la base de datos
- Las fechas están en formato ISO 8601 (UTC)
- Los precios y costos son decimales con 2 decimales
- El campo `detalle_aplicaciones` en fertilización es un array JSON

---

## 🔗 Recursos Adicionales

- **API Root:** `http://localhost:8000/api/`
- **Admin Panel:** `http://localhost:8000/admin/`
- **Endpoints de Parcelas:** `http://localhost:8000/api/agri-data/parcelas/`
- **Endpoints de Cultivos:** `http://localhost:8000/api/agri-data/cultivos/`

---

**¿Preguntas?** Contacta al equipo de backend para más detalles sobre la lógica de IA o datos de prueba.
