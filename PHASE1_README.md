# Phase 1 Implementation - Disponibilidades Dinámicas

## 📦 Archivos Creados

### 1. **`src/hooks/useDisponibilidades.js`**
Hooks para obtener y filtrar disponibilidades del backend

#### Exports:
- `useDisponibilidades()` - Obtener todas las disponibilidades
- `useDisponibilidadById(id)` - Obtener una disponibilidad específica
- `useDisponibilidadesPorEspecialidad(especialidad)` - Filtrar por especialidad
- `useDisponibilidadesPorLocalidad(localidad)` - Filtrar por localidad

#### Ejemplo:
```jsx
import { useDisponibilidades } from "../hooks/useDisponibilidades";

function Services() {
  const { disponibilidades, loading, error } = useDisponibilidades();
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage msg={error} />;
  
  return (
    <div>
      {disponibilidades.map(disp => (
        <Card key={disp._id} {...disp} />
      ))}
    </div>
  );
}
```

---

### 2. **`src/data/especialidadImagenes.js`**
Mapeo de especialidades a imágenes

#### Exports:
- `especialidadImagenes` - Objeto con mapeos especialidad → imagen
- `getImagenEspecialidad(especialidad)` - Obtener imagen para especialidad
- `getEspecialidadesDisponibles()` - Listar todas las especialidades
- `especialidadExiste(especialidad)` - Validar si existe especialidad

#### Ejemplo:
```jsx
import { getImagenEspecialidad } from "../data/especialidadImagenes";

const imgUrl = getImagenEspecialidad("Apoyo a la familia del paciente");
// Retorna: "https://via.placeholder.com/300?text=Apoyo+Familia"
```

---

### 3. **`src/helpers/disponibilidadesHelper.js`**
Funciones para normalizar y procesar datos de disponibilidades

#### Exports:
- `normalizarDisponibilidadACard(disponibilidad)` - Convertir a estructura Card
- `normalizarDisponibilidades(disponibilidades)` - Normalizar array
- `extraerProfesional(disponibilidad)` - Obtener datos del profesional
- `extraerHorarios(disponibilidad)` - Obtener lista de horarios
- `crearItemCarrito(disponibilidad, horarioId, hora)` - Crear item para carrito
- `validarDisponibilidad(disponibilidad)` - Validar estructura

#### Ejemplo:
```jsx
import { normalizarDisponibilidades, extraerProfesional } from "../helpers";

const disponibilidades = [...]; // del backend
const cardsNormalizadas = normalizarDisponibilidades(disponibilidades);

// Para cada disponibilidad:
const profesional = extraerProfesional(disponibilidades[0]);
console.log(profesional); // { id, nombre, apellido, especialidades, localidades }
```

---

### 4. **`src/helpers/testPhase1.js`**
Tests unitarios para validar Phase 1

#### Exports:
- `ejecutarTodoTestPhase1()` - Ejecutar todos los tests

#### Como usar en consola:
```javascript
import { ejecutarTodoTestPhase1 } from "./helpers/testPhase1";

ejecutarTodoTestPhase1();
// Verá en console:
// ✅ TEST 1: Especialidades
// ✅ TEST 2: Validación
// ✅ TEST 3: Normalización
// ✅ TEST 4: Hook (instrucciones)
```

---

## 🚀 Cómo Usar en Componentes

### Ejemplo 1: Services.jsx (usando Hook)
```jsx
import { useDisponibilidades } from "../hooks/useDisponibilidades";
import { normalizarDisponibilidades } from "../helpers";
import Card from "../components/Card";
import Spinner from "../components/Spinner";

const Services = () => {
  const { disponibilidades, loading, error } = useDisponibilidades();

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  const cards = normalizarDisponibilidades(disponibilidades);

  return (
    <div className="grid grid-cols-4">
      {cards.map(card => (
        <Card 
          key={card.id} 
          image={card.image} 
          text={card.text} 
          count={card.count} 
          link={card.link} 
        />
      ))}
    </div>
  );
};

export default Services;
```

### Ejemplo 2: Service.jsx (usando Hook por ID)
```jsx
import { useDisponibilidadById } from "../hooks/useDisponibilidades";
import { extraerProfesional, extraerHorarios } from "../helpers";

const Service = () => {
  const { search } = useLocation();
  const disponibilidadId = new URLSearchParams(search).get("id");
  
  const { disponibilidad, loading, error } = useDisponibilidadById(disponibilidadId);

  if (loading) return <Spinner />;
  if (error || !disponibilidad) return <div>No encontrado</div>;

  const profesional = extraerProfesional(disponibilidad);
  const horarios = extraerHorarios(disponibilidad);

  return (
    <div>
      <h1>{profesional.nombre} {profesional.apellido}</h1>
      <p>Especialidad: {profesional.especialidades.join(", ")}</p>
      <select>
        {horarios.map(h => (
          <option 
            key={h.id} 
            value={h.id}
            disabled={!h.disponible}
          >
            {h.hora} {h.disponible ? "" : "(No disponible)"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Service;
```

---

## ✅ Checklist Phase 1

- [x] Crear hook `useDisponibilidades`
- [x] Crear hooks de filtrado
- [x] Crear mapeo especialidades → imágenes
- [x] Crear helpers de normalización
- [x] Crear helpers de validación
- [x] Crear tests
- [x] Documentación

## 🔄 Next: Phase 2

Una vez Phase 1 esté validada:
1. Actualizar `Services.jsx` para usar el hook
2. Actualizar `Service.jsx` para leer ID de URL
3. Validar flujo completo

---

## 📝 Notas Técnicas

### Estructura de Disponibilidad (Backend)
```javascript
{
  _id: String,                    // ID único
  fecha: String,                  // Fecha YYYY-MM-DD
  horarios: Array<{               // Array de horarios
    hora: String,                 // Formato HH:MM-HH:MM
    stock: Boolean,               // Disponibilidad
    _id: String
  }>,
  creador: {
    _id: String,                  // ID del profesional
    especialidad: Array<String>,  // Especialidades
    localidadesLaborales: Array<String>, // Localidades
    creador: {
      _id: String,                // ID del usuario
      nombre: String,
      apellido: String
    }
  },
  disponibilidad: Array<...>      // Espejo de horarios (redundante?)
}
```

### Estructura Normalizada para Card
```javascript
{
  id: String,                     // _id de disponibilidad
  image: String,                  // URL de imagen
  text: String,                   // Especialidad
  count: String,                  // Cantidad de horarios
  link: String,                   // URL a /servicio?id=...
  metadata: {                     // Datos adicionales
    disponibilidadId: String,
    profesional: String,
    especialidad: String,
    fecha: String,
    horariosDisponibles: Number
  }
}
```

---

## 🐛 Debugging

### Ver estructura en consola
```javascript
import { normalizarDisponibilidades } from "../helpers";

const data = [...]; // disponibilidades del backend
const normalizado = normalizarDisponibilidades(data);

console.table(normalizado);
// Verá tabla con: id, image, text, count, link
```

### Validar disponibilidad
```javascript
import { validarDisponibilidad } from "../helpers";

const errores = validarDisponibilidad(disponibilidad);
if (errores.length > 0) {
  console.error("❌ Disponibilidad inválida:", errores);
} else {
  console.log("✅ Disponibilidad válida");
}
```

---

## 🎯 Próximo Paso: Phase 2

Modificar `Services.jsx` para usar `useDisponibilidades()`.

Ver: `PLAN_IMPLEMENTACION_DISPONIBILIDADES.md`

