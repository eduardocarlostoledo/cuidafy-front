# Análisis de Migración de Esquema Hardcodeado a Dinámico

## 1. COMPONENTES ACTUALES Y SU ESTADO

### 1.1 **Productos.jsx** ✅ PARCIALMENTE DINAMIZADO
- **Estado**: Consume `/api/products` (reciente cambio)
- **Datos**: Obtiene productos del backend
- **Renderizado**: Tarjetas con imagen, nombre, descripción, precio
- **Acciones**: Link para ver producto
- **Próximos pasos**: Implementar lógica de carrito desde aquí

---

### 1.2 **Services.jsx** ❌ HARDCODEADO
- **Estado**: Usa array estático `services` de `data/index.js`
- **Estructura**: 
  ```jsx
  services.map((service) => (
    <Card ... />
  ))
  ```
- **Problema**: Los servicios son categorías fijas, no dinámicas
- **Backend endpoint disponible**: `/api/disponibilidades-totales` (existe en otros componentes)

---

### 1.3 **Service.jsx** 🟡 SEMIFUNCIONAL
- **Estado**: Página de detalles/reserva individual
- **Flujo actual**:
  1. Usuario ve paso 1 (ServiceDetails)
  2. Puede agregar productos al carrito
  3. El carrito se guarda en `localStorage` (services)
- **Renderizado**: Solo renderiza `ServiceDetails` cuando currentStep === "1"
- **Problema**: No carga datos específicos del producto por ID (URL params)

---

### 1.4 **Pages.jsx** 🟡 PARCIALMENTE DINÁMICO
- **Estado**: Página de pago/checkout
- **Datos dinámicos**: 
  - Información del usuario desde `/api/usuarios/perfil/{id}`
  - Localidades desde `localStorage`
- **Servicios**: Toma del carrito (`localStorage.services`)
- **Problema**: Depende de que el carrito esté lleno

---

### 1.5 **ServiceDetails.jsx** 🟡 PARCIALMENTE DINÁMICO
- **Estado**: Componente del carrito
- **Datos**: Obtiene de `localStorage` (servicios agregados)
- **Flujo**:
  1. Permite agregar/quitar productos
  2. Muestra resumen de carrito
  3. Calcula totales
- **Backend**: No consume endpoint para obtener productos individuales

---

## 2. FLUJO ACTUAL DE RESERVA

```
Productos.jsx (catálogo)
    ↓
    → User hace click en "Ver Producto"
    ↓
Service.jsx (detalles)
    ↓
    → ServiceDetails.jsx (carrito)
    ↓
    → User agrega al carrito (localStorage)
    ↓
Pages.jsx (checkout/pago)
    ↓
    → Confirma reserva
```

---

## 3. PROBLEMAS IDENTIFICADOS

| Componente | Problema | Impacto |
|-----------|----------|--------|
| **Services.jsx** | Array hardcodeado | No muestra nuevas categorías sin redeploy |
| **Service.jsx** | No Lee ID de producto de URL | No carga datos específicos |
| **ServiceDetails.jsx** | Depende solo de localStorage | No sincroniza con backend |
| **Pages.jsx** | Asume carrito completo | Falla si localStorage está vacío |
| **Productos.jsx** | No integra con carrito | Aislado del flujo de reserva |

---

## 4. PROPUESTA DE MIGRACIÓN

### Fase 1: Componentes de Lectura (Bajo riesgo)
✅ **Productos.jsx** (ya hecho)
- [x] Consumir `/api/products`
- [x] Renderizar lista dinámica
- [ ] Agregar botón "Agregar al Carrito"
- [ ] Validar estructura de datos

### Fase 2: Componentes de Detalle (Medio riesgo)
**Service.jsx**
- [ ] Leer ID de producto de URL params o query
- [ ] Consumir `/api/products/{id}` para detalles
- [ ] Cargar datos específicos del producto
- [ ] Mantener compatibilidad con carrito en localStorage

**ServiceDetails.jsx**
- [ ] Refactorizar para recibir props de producto
- [ ] Mantener lógica de carrito en localStorage
- [ ] Validar totales y descuentos

### Fase 3: Componentes de Listado (Medio riesgo)
**Services.jsx**
- [ ] Consumir `/api/disponibilidades-totales`
- [ ] Mapear estructura de datos
- [ ] Renderizar Cards dinámicamente
- [ ] Aplicar filtros desde backend

### Fase 4: Componentes de Checkout (Alto riesgo)
**Pages.jsx**
- [ ] Validar carrito antes de checkout
- [ ] Sincronizar con backend si es necesario
- [ ] Guardar orden en backend
- [ ] Manejar estados de pago

---

## 5. ESTRUCTURA DE DATOS ESPERADA

### Products API (`/api/products`)
```javascript
{
  resultados: [
    {
      _id: "69415be550937c3dd1528fa6",
      nombre: "Cuidado Internado",
      descripcion: "Apoyo a la familia del paciente",
      precio: "1500",
      precio_regular: "2000",
      img: "https://...",
      link: "https://...",
      cantidad: 1,
      porcetajeCuidafy: 39,
      porcetajeProfesional: 61
    }
  ],
  totalProductos: 1,
  totalPaginas: 1,
  paginaActual: 1
}
```

### Disponibilidades Totales (`/api/disponibilidades-totales`) - ESTRUCTURA REAL
```javascript
[
  {
    _id: "6940a0dbdb30ed80a7724c8a",
    fecha: "2025-12-20",  // Fecha disponible
    horarios: [  // Array de horarios disponibles
      {
        hora: "06:00-07:00",
        stock: true,
        _id: "6940a0dbdb30ed80a7724c8b"
      },
      {
        hora: "07:00-08:00",
        stock: true,
        _id: "6940a0dbdb30ed80a7724c8c"
      }
      // ... más horarios
    ],
    creador: {  // Info del profesional
      _id: "694092b9831c7890b7c4e120",
      especialidad: ["Apoyo a la familia del paciente"],
      localidadesLaborales: ["1. Posadas"],
      creador: {
        _id: "694092b9831c7890b7c4e11f",
        nombre: "Test",
        apellido: "Test"
      }
    },
    disponibilidad: [  // Espejo de horarios (duplicado?)
      {
        hora: "06:00-07:00",
        stock: true,
        _id: "6940a0dbdb30ed80a7724c8b"
      }
      // ... mismo contenido que horarios
    ]
  }
]
```

### Estructura Normalizada para el Frontend
```javascript
{
  profesional: {
    id: "694092b9831c7890b7c4e120",
    nombre: "Test",
    apellido: "Test",
    especialidad: ["Apoyo a la familia del paciente"],
    localidades: ["1. Posadas"]
  },
  disponibilidad: {
    fecha: "2025-12-20",
    horarios: [
      { hora: "06:00-07:00", disponible: true, id: "..." },
      { hora: "07:00-08:00", disponible: true, id: "..." }
    ]
  }
}
```


---

## 6. RECOMENDACIONES DE IMPLEMENTACIÓN

### Paso 1: Crear Hook para Disponibilidades
```jsx
// hooks/useDisponibilidades.js
const useDisponibilidades = () => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await clienteAxios.get("/api/disponibilidades-totales");
        // data es array directamente
        setDisponibilidades(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  
  return { disponibilidades, loading };
};
```

### Paso 2: Actualizar Services.jsx
```jsx
// Cambiar de:
import { services } from '../data'  // array estático

// A:
const { disponibilidades, loading } = useDisponibilidades();

// Estructura normalizada para Card
const servicios = disponibilidades?.map(disp => ({
  id: disp._id,
  image: "imagen-por-especialidad",  // mapear especialidad a imagen
  text: disp.creador.especialidad[0],  // primera especialidad
  count: disp.horarios.length,  // cantidad de horarios disponibles
  link: `/servicio?id=${disp._id}`  // link dinámico
}));
```

### Paso 3: Actualizar Service.jsx
```jsx
// Leer ID de URL
const { search } = useLocation();
const disponibilidadId = new URLSearchParams(search).get("id");

// Obtener disponibilidad específica
useEffect(() => {
  if (!disponibilidadId) return;
  const fetchDisponibilidad = async () => {
    try {
      const { data } = await clienteAxios.get(
        `/api/disponibilidades-totales` // Filtrar en frontend o backend
      );
      const actual = data.find(d => d._id === disponibilidadId);
      setDisponibilidad(actual);
    } catch (error) {
      console.error(error);
    }
  };
  fetchDisponibilidad();
}, [disponibilidadId]);
```

### Paso 4: Mapeo Especialidad → Imagen
```jsx
// data/especialidadImagenes.js
export const especialidadImagenes = {
  "Apoyo a la familia del paciente": "https://...",
  "Control de signos vitales básicos": "https://...",
  "Cuidado paliativo y hospice": "https://...",
  // ... más
};

// En Services.jsx
const servicios = disponibilidades?.map(disp => ({
  id: disp._id,
  image: especialidadImagenes[disp.creador.especialidad[0]],
  text: disp.creador.especialidad[0],
  count: disp.horarios.length,
  link: `/servicio?id=${disp._id}`
}));
```

### Prioridad Alta
1. ✅ **Crear hook `useDisponibilidades`**: Reutilizar en múltiples componentes
2. ✅ **Dinamizar Services.jsx**: Consumir `/api/disponibilidades-totales`
3. ✅ **Actualizar Service.jsx**: Leer ID de URL
4. [ ] **Crear mapeo Especialidad→Imagen**: Para las Cards

### Prioridad Media
5. [ ] **Refactorizar carrito**: Usar Redux en lugar de localStorage
6. [ ] **Validar checkout**: Asegurar que Pages.jsx maneja errores

### Prioridad Baja
7. [ ] **Optimizar componentes**: Lazy loading, memoización
8. [ ] **Agregar caché**: Evitar requests duplicados

---

## 7. PRÓXIMOS PASOS

1. **Modificar Service.jsx**: Para leer `productId` de URL
2. **Crear hook personalizado**: `useProducto(id)` para reutilizar
3. **Actualizar Services.jsx**: Consumir endpoint dinámico
4. **Refactorizar carrito**: Usar Redux en lugar de localStorage
5. **Validar flujo completo**: Productos → Reserva → Pago

---

## 8. IMPACTO Y RIESGOS

| Cambio | Beneficio | Riesgo | Mitigación |
|--------|-----------|--------|-----------|
| Dinamizar Products | Actualizaciones sin redeploy | Cambios estructura API | Versionado de API |
| Leer ID en Service | Detalles únicos por producto | URL breaks | Validar params |
| Consumir disponibilidades | Listado actualizado | Performance | Paginación + caché |
| Refactorizar carrito | Mejor persistencia | Breaking changes | Testing exhaustivo |

---

## 9. CHECKLIST DE VALIDACIÓN

- [ ] Todos los endpoints responden correctamente
- [ ] Estructura de datos es consistente
- [ ] LocalStorage se sincroniza con Backend
- [ ] Carrito persiste entre páginas
- [ ] Checkout funciona end-to-end
- [ ] Manejo de errores implementado
- [ ] Loading states mostrados
- [ ] Testing en navegadores múltiples

