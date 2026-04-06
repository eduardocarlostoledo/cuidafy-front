# PLAN DE IMPLEMENTACIÓN - Migración a Disponibilidades Dinámicas

## 📋 ESTRUCTURA DE DATOS REAL

### Endpoint: `/api/disponibilidades-totales`
**Retorna**: Array de disponibilidades con horarios

```javascript
[
  {
    _id: "6940a0dbdb30ed80a7724c8a",
    fecha: "2025-12-20",
    horarios: [
      { hora: "06:00-07:00", stock: true, _id: "..." },
      { hora: "07:00-08:00", stock: true, _id: "..." },
      // ... 16 horarios
    ],
    creador: {
      _id: "694092b9831c7890b7c4e120",
      especialidad: ["Apoyo a la familia del paciente"],
      localidadesLaborales: ["1. Posadas"],
      creador: {
        _id: "694092b9831c7890b7c4e11f",
        nombre: "Test",
        apellido: "Test"
      }
    },
    disponibilidad: [ /* mismo contenido que horarios */ ]
  }
]
```

---

## 🔄 FLUJO DE DATOS NUEVO

### Paso 1: Services.jsx (Listado de Disponibilidades)
```
Frontend Load
    ↓
GET /api/disponibilidades-totales
    ↓
Mapear a estructura Card
    ↓
Renderizar Cards con especialidad + horarios disponibles
    ↓
User click en Card → /servicio?id={disponibilidadId}
```

### Paso 2: Service.jsx (Detalles de Disponibilidad)
```
URL: /servicio?id=6940a0dbdb30ed80a7724c8a
    ↓
Leer query param "id"
    ↓
GET /api/disponibilidades-totales (filtrar en frontend o backend)
    ↓
Find disponibilidad por _id
    ↓
Renderizar detalles:
  - Profesional: nombre, apellido
  - Especialidad: ["Apoyo a la familia del paciente"]
  - Fecha: 2025-12-20
  - Horarios disponibles: lista con checkbox
    ↓
User selecciona horario
    ↓
Agregar a carrito con datos:
  {
    disponibilidadId: "6940a0dbdb30ed80a7724c8a",
    profesionalId: "694092b9831c7890b7c4e120",
    fecha: "2025-12-20",
    hora: "06:00-07:00",
    horarioId: "6940a0dbdb30ed80a7724c8b"
  }
```

### Paso 3: ServiceDetails.jsx (Carrito)
```
LocalStorage["services"] contains:
[
  {
    disponibilidadId: "...",
    profesionalId: "...",
    fecha: "...",
    hora: "06:00-07:00",
    horarioId: "..."
  }
]
    ↓
Renderizar items del carrito
    ↓
User confirma → Pages.jsx (pago)
```

---

## 📦 COMPONENTES A CREAR/MODIFICAR

### 1. `hooks/useDisponibilidades.js` (NUEVO)
**Responsabilidad**: Obtener y cachear disponibilidades
```javascript
export const useDisponibilidades = () => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await clienteAxios.get("/api/disponibilidades-totales");
      setDisponibilidades(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDisponibilidades([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetch();
  }, [fetch]);
  
  return { disponibilidades, loading, error, refetch: fetch };
};
```

### 2. `Services.jsx` (MODIFICAR)
**Cambios**:
- Eliminar `import { services }`
- Agregar `useDisponibilidades()`
- Mapear disponibilidades a estructura Card
- Mantener renderizado actual de Cards

**Antes**:
```jsx
import { services } from '../data'
services.map(service => <Card ... />)
```

**Después**:
```jsx
const { disponibilidades, loading } = useDisponibilidades();

const servicios = disponibilidades?.map(disp => ({
  id: disp._id,
  image: getImagenEspecialidad(disp.creador.especialidad[0]),
  text: disp.creador.especialidad[0],
  count: disp.horarios.length,
  link: `/servicio?id=${disp._id}`
}));

if (loading) return <Spinner />;
return servicios.map(service => <Card ... />);
```

### 3. `Service.jsx` (MODIFICAR)
**Cambios**:
- Leer `disponibilidadId` de URL
- Obtener disponibilidad específica
- Renderizar detalles con horarios
- Integrar con carrito

**Nuevo código**:
```jsx
const { search } = useLocation();
const disponibilidadId = new URLSearchParams(search).get("id");

const [disponibilidad, setDisponibilidad] = useState(null);

useEffect(() => {
  if (!disponibilidadId) return;
  const fetch = async () => {
    try {
      const { data } = await clienteAxios.get("/api/disponibilidades-totales");
      const actual = Array.isArray(data) 
        ? data.find(d => d._id === disponibilidadId)
        : null;
      setDisponibilidad(actual);
    } catch (error) {
      message.error("Error cargando disponibilidad");
    }
  };
  fetch();
}, [disponibilidadId]);
```

### 4. `data/especialidadImagenes.js` (NUEVO)
**Responsabilidad**: Mapear especialidades a imágenes
```javascript
export const especialidadImagenes = {
  "Apoyo a la familia del paciente": "https://...",
  "Control de signos vitales básicos": "https://...",
  "Cuidado paliativo y hospice": "https://...",
  // ... todas las especialidades
};

export const getImagenEspecialidad = (especialidad) => {
  return especialidadImagenes[especialidad] 
    || "https://via.placeholder.com/300";
};
```

---

## 🎯 PASOS DE IMPLEMENTACIÓN

### Fase 1: Hooks (30 minutos)
- [ ] Crear `hooks/useDisponibilidades.js`
- [ ] Crear `data/especialidadImagenes.js`
- [ ] Testing del hook

### Fase 2: Services.jsx (45 minutos)
- [ ] Importar `useDisponibilidades`
- [ ] Mapear datos
- [ ] Mantener renderizado
- [ ] Testing

### Fase 3: Service.jsx (60 minutos)
- [ ] Leer URL params
- [ ] Obtener disponibilidad
- [ ] Renderizar detalles
- [ ] Integrar carrito
- [ ] Testing

### Fase 4: Carrito (30 minutos)
- [ ] Validar estructura
- [ ] Sincronizar localStorage
- [ ] Testing

---

## ⚠️ CONSIDERACIONES

### URLs Cambiarán
**Antes**: `/servicio?id=816` (ID de producto WP)
**Después**: `/servicio?id=6940a0dbdb30ed80a7724c8a` (ID de disponibilidad)

### Impacto en Componentes
- **Productos.jsx**: Independiente (sigue igual)
- **Pages.jsx**: Necesita ajuste en estructura del carrito
- **ServiceDetails.jsx**: Requiere validación

### Validaciones Necesarias
- Verificar que `horarios` tiene datos
- Validar que `creador.creador` existe
- Manejar disponibilidades vacías
- Sincronizar stock en carrito

---

## 🧪 TESTING CHECKLIST

- [ ] Services carga sin errores
- [ ] Cards muestran datos correctos
- [ ] Click en Card navega a URL correcta
- [ ] Service.jsx carga detalles
- [ ] Horarios se renderizan
- [ ] Carrito persiste datos
- [ ] Checkout valida carrito
- [ ] Manejo de errores funciona

---

## 📝 NOTAS

1. **Duplicación de datos**: El backend retorna `horarios` y `disponibilidad` con el mismo contenido. Considerar usar solo `horarios` en frontend.

2. **Imágenes por especialidad**: No hay imagen en el endpoint. Crear mapeo manual o solicitar al backend.

3. **LocalStorage**: Actualmente usa `localStorage.services`. Validar formato al cambiar de productos a disponibilidades.

4. **Performance**: Si hay muchas disponibilidades, considerar paginación o filtros en backend.

