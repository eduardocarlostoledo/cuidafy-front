# COMPARATIVA: ANTES vs DESPUÉS

## 🔴 ANTES (Hardcodeado)

### Services.jsx
```
import { services } from '../data'

services = [
  {
    id: 1,
    image: "url-fija",
    text: "Masaje descontracturante",
    count: "2",
    link: "https://calyaan.com/..."
  },
  // ... más servicios fijos
]

↓ Renderizar
```

**Problema**: Agregar nuevo servicio = redeploy

---

### Service.jsx
```
URL: /servicio?id=816

localStorage.services = [
  { img: "...", nombre: "Masaje", precio: "100" }
]

↓ ServiceDetails renderiza solo localStorage
```

**Problema**: No hay conexión con backend de disponibilidades

---

## 🟢 DESPUÉS (Dinámico)

### Services.jsx
```
const { disponibilidades } = useDisponibilidades()

disponibilidades = [
  {
    _id: "6940a0dbdb30ed80a7724c8a",
    fecha: "2025-12-20",
    horarios: [{hora: "06:00-07:00", stock: true}, ...],
    creador: {
      especialidad: ["Apoyo a la familia del paciente"],
      creador: { nombre: "Test", apellido: "Test" }
    }
  },
  // ... más disponibilidades del backend
]

↓ Mapear a Card
servicios = disponibilidades.map(disp => ({
  id: disp._id,
  image: getImagenEspecialidad(disp.creador.especialidad[0]),
  text: disp.creador.especialidad[0],
  count: disp.horarios.length,
  link: `/servicio?id=${disp._id}`
}))

↓ Renderizar igual que antes
```

**Ventaja**: Agregar disponibilidad = automático (sin redeploy)

---

### Service.jsx
```
URL: /servicio?id=6940a0dbdb30ed80a7724c8a

const disponibilidadId = new URLSearchParams(search).get("id")

const [disponibilidad, setDisponibilidad] = useState(null)

useEffect(() => {
  const { data } = await clienteAxios.get("/api/disponibilidades-totales")
  const actual = data.find(d => d._id === disponibilidadId)
  setDisponibilidad(actual)
}, [disponibilidadId])

↓ Renderizar detalles dinámicos
{disponibilidad && (
  <div>
    <h2>{disponibilidad.creador.creador.nombre}</h2>
    <p>{disponibilidad.creador.especialidad[0]}</p>
    <select>
      {disponibilidad.horarios.map(h => (
        <option>{h.hora}</option>
      ))}
    </select>
  </div>
)}

↓ Agregar al carrito
localStorage.services = [{
  disponibilidadId: "6940a0dbdb30ed80a7724c8a",
  profesionalId: "694092b9831c7890b7c4e120",
  fecha: "2025-12-20",
  hora: "06:00-07:00"
}]
```

**Ventaja**: Cada usuario ve profesionales diferentes según disponibilidad

---

## 📊 COMPARATIVA VISUAL

| Aspecto | ANTES | DESPUÉS |
|--------|-------|---------|
| **Fuente de datos** | Array en código | Backend `/api/disponibilidades-totales` |
| **Estructura** | `id, image, text, count` | `_id, creador, fecha, horarios` |
| **URL Service** | `/servicio?id=816` | `/servicio?id=6940a0db...` |
| **Carrito** | `{ img, nombre, precio }` | `{ disponibilidadId, fecha, hora }` |
| **Actualización** | Redeploy necesario | Automática |
| **Escalabilidad** | Limitada | Ilimitada |
| **Profesionales** | No visible | Visible (nombre, especialidad) |
| **Horarios** | Fijos | Dinámicos por fecha |

---

## 🔗 CAMBIOS EN FLUJO

### ANTES
```
Usuarios ven siempre los mismos servicios
    ↓
Click en "Masaje Descontracturante"
    ↓
localStorage.services con datos hardcodeados
    ↓
Checkout con info fija
```

### DESPUÉS
```
Sistema carga disponibilidades reales del backend
    ↓
Usuarios ven profesionales + especialidades + horarios
    ↓
Click en "Apoyo a la familia del paciente" (de profesional X)
    ↓
localStorage.services con: disponibilidadId, fecha, hora
    ↓
Checkout con info real del profesional elegido
```

---

## 🎯 EJEMPLO PRÁCTICO

### Escenario: Usuario elige "Cuidado Internado"

#### ANTES (Hardcodeado)
```javascript
// Services.jsx muestra
{
  id: 1,
  image: "https://calyaan.com/...",
  text: "Cuidado Internado",
  count: "2",
  link: "https://calyaan.com/..."
}

// Click → localStorage.services
[{ img: "url", nombre: "Cuidado Internado", precio: "2000" }]

// ❌ NO sabe quién es el profesional
// ❌ NO sabe qué fecha
// ❌ NO sabe qué hora
```

#### DESPUÉS (Dinámico)
```javascript
// Services.jsx muestra (del backend)
{
  id: "6940a0dbdb30ed80a7724c8a",
  image: getImagen("Apoyo a la familia del paciente"),
  text: "Apoyo a la familia del paciente",
  count: 16,  // 16 horarios disponibles
  link: "/servicio?id=6940a0dbdb30ed80a7724c8a"
}

// Click → Service.jsx carga detalles
{
  profesional: "Test Test",
  especialidad: "Apoyo a la familia del paciente",
  fecha: "2025-12-20",
  horarios: ["06:00-07:00", "07:00-08:00", ...] ✅ 16 opciones
}

// User selecciona hora "06:00-07:00" → localStorage.services
[{
  disponibilidadId: "6940a0dbdb30ed80a7724c8a",
  profesionalId: "694092b9831c7890b7c4e120",
  fecha: "2025-12-20",
  hora: "06:00-07:00"
}]

// ✅ Checkout sabe exactamente quién, cuándo y a qué hora
```

---

## ⏱️ TIMELINE ESTIMADO

| Fase | Tarea | Tiempo | Prioridad |
|------|-------|--------|-----------|
| 1 | Crear hook useDisponibilidades | 30 min | 🔴 Alta |
| 2 | Crear mapeo especialidades | 15 min | 🔴 Alta |
| 3 | Actualizar Services.jsx | 45 min | 🔴 Alta |
| 4 | Actualizar Service.jsx | 60 min | 🔴 Alta |
| 5 | Testing e integración | 45 min | 🟡 Media |
| **TOTAL** | | **195 min** | |

**Estimación**: ~3-4 horas de desarrollo

