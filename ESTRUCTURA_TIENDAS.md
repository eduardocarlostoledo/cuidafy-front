# 🛍️ ESTRUCTURA DE TIENDAS EN CALYAAN

## Las 3 "Tiendas" de la App

### 1️⃣ SERVICIOS (Disponibilidades de Profesionales) 🏥
**Ruta**: `/servicios`
**Componente**: `Services.jsx`
**Datos**: Del backend `/api/disponibilidades-totales`

#### Qué veo:
- Cards de profesionales con **especialidades** disponibles
- Filtros por especialidad
- Horarios disponibles por profesional
- Información del profesional (nombre, especialidad, fecha)

#### Flujo:
```
/servicios → Click en Card → /servicio?id=XXX → Ver detalles → Agregar al carrito
```

#### Ejemplo de Items:
```
┌─────────────────────────────┐
│ [Imagen especialidad]       │
│ Apoyo a la familia          │
│ 16 horarios disponibles     │
│ Juan Pérez | Misiones       │
│ Fecha: 2025-12-20           │
│ [Click para detalles]       │
└─────────────────────────────┘
```

**Estado**: ✅ **DINÁMICO** (implementado Phase 2)

---

### 2️⃣ PRODUCTOS (Tienda de Productos) 🛒
**Ruta**: `/productos`
**Componente**: `Productos.jsx`
**Datos**: Del backend `/api/products`

#### Qué veo:
- Cards de **productos físicos** (servicios premium, paquetes, etc.)
- Nombre, descripción, imagen, precio
- Descuento (si aplica)

#### Flujo:
```
/productos → Click en Card → Ir a producto en web → Comprar
```

#### Ejemplo de Items:
```
┌─────────────────────────────┐
│ [Imagen producto]           │
│ Paquete 10 masajes          │
│ Descripción del producto    │
│ $500 | $400 (desc)          │
│ [Ir a producto]             │
└─────────────────────────────┘
```

**Estado**: ✅ **DINÁMICO** (ya existía)

---

### 3️⃣ ADMIN - PRODUCTOS (Gestión) ⚙️
**Ruta**: `/set-productos` (dentro de Dashboard Admin)
**Componente**: `SetProductos.jsx`
**Datos**: Del backend `/api/products`

#### Qué veo:
- Tabla con TODOS los productos
- Acciones: Crear, Editar, Eliminar
- Información: ID, nombre, precio, imagen, tags

#### Flujo:
```
Dashboard → Productos → Tabla → [Crear/Editar/Eliminar]
```

**Estado**: ✅ **COMPLETO** (CRUD implementado)

---

## 📊 COMPARATIVA

| Aspecto | Servicios | Productos | Admin |
|---------|-----------|-----------|-------|
| **Ruta** | /servicios | /productos | /set-productos |
| **Tipo** | Disponibilidades de profesionales | Productos físicos/paquetes | Gestión admin |
| **Datos** | /api/disponibilidades-totales | /api/products | /api/products |
| **Dinámico** | ✅ Phase 2 | ✅ Existente | ✅ Existente |
| **Filtros** | Especialidad | Ninguno | Tabla con search |
| **Carrito** | ✅ Redux Phase 3 | ❌ No (compra directa) | N/A |
| **Flujo** | Agregar → Checkout | Link externo | CRUD |

---

## 🎯 DÓNDE VES QUÉ

### Para CONTRATAR SERVICIOS (Disponibilidades):
**→ `/servicios`** 
- Ves profesionales disponibles
- Puedes filtrar por especialidad
- Seleccionas horario
- Agregas al carrito
- Vas a checkout

### Para VER PRODUCTOS (Venta):
**→ `/productos`**
- Ves catálogo de productos
- Puedes ir directamente a compra en web
- No integrado con checkout de Cuidafy (aún)

### Para GESTIONAR PRODUCTOS (Admin):
**→ Dashboard → Productos (`/set-productos`)**
- CRUD completo
- Tabla de administración
- Crear/editar/eliminar

---

## 🔄 FLUJO COMPLETO DE USUARIO

### Escenario 1: USUARIO QUIERE CONTRATAR UN SERVICIO
```
1. Va a /servicios
   ↓
2. Ve filtros de especialidades
   ↓
3. Selecciona especialidad (ej: "Apoyo a la familia")
   ↓
4. Ve cards de profesionales con esa especialidad
   ↓
5. Hace click en un profesional
   ↓
6. Va a /servicio?id=XXX
   ↓
7. Ve detalles: nombre, horarios disponibles
   ↓
8. Selecciona horario + Click "Agregar al carrito"
   ↓
9. Aparece en carrito (Redux)
   ↓
10. Puede agregar más servicios
    ↓
11. Click "Proceder al Pago"
    ↓
12. Va a /pago → Pages.jsx
    ↓
13. Completa checkout y paga
```

### Escenario 2: USUARIO QUIERE VER PRODUCTOS
```
1. Va a /productos
   ↓
2. Ve catálogo de productos
   ↓
3. Hace click en producto
   ↓
4. Lo lleva a web de Cuidafy (link externo)
```

### Escenario 3: ADMIN GESTIONA PRODUCTOS
```
1. Va a /dashboard
   ↓
2. Abre menú "Productos"
   ↓
3. Va a "Mis Productos" → /set-productos
   ↓
4. Ve tabla con todos los productos
   ↓
5. Puede: Crear, Editar, Eliminar
```

---

## ⚙️ INTEGRACIÓN ACTUAL

### ✅ COMPLETO (Services)
```
/servicios 
  ├─ useDisponibilidades() → Hook para datos
  ├─ normalizarDisponibilidades() → Transformar
  ├─ Filtros por especialidad
  ├─ Click → /servicio?id=XXX
  └─ Agregar al carrito (Redux Phase 3)
```

### ✅ PARCIAL (Productos)
```
/productos 
  ├─ Fetch desde /api/products
  ├─ Grid de cards
  └─ Link a web (no integrado con checkout Cuidafy)
```

### ⚠️ MEJORA PENDIENTE
```
/pago (Pages.jsx)
  └─ Necesita consumir carrito Redux Phase 3
```

---

## 🚀 LO QUE ESTÁ FALTANDO

### Para que `/productos` sea igual que `/servicios`:
1. Agregar al carrito desde productos también
2. Usar mismo hook useCarrito() de Redux
3. Mostrar preview en carrito
4. Mergear con checkout

### Para que `/pago` sea completo:
1. Consumir `carrito.items` desde Redux
2. Generar resumen con `useCheckout()`
3. Procesar pago
4. Guardar orden en backend

---

## 📍 MAPA VISUAL

```
INICIO (Login)
│
├─→ USUARIO FINAL
│   ├─ /servicios (Contratar servicios) ✅ DINÁMICO
│   │  └─ /servicio?id=XXX (Detalles) ✅ DINÁMICO
│   │     └─ [Agregar carrito] → Redux
│   │
│   ├─ /productos (Ver productos) ✅ DINÁMICO
│   │  └─ [Ir a web] (Link externo)
│   │
│   ├─ /carrito (Implícito en Redux)
│   │  └─ /pago (Checkout) ⚠️ NECESITA UPDATE
│   │
│   └─ /historial (Ver reservas)
│
├─→ PROFESIONAL
│   ├─ /horarios (Gestionar horarios)
│   ├─ /calendario (Ver calendario)
│   └─ /historial-servicios (Ver reservas)
│
└─→ ADMIN
    ├─ /set-productos (Gestionar productos) ✅ CRUD
    ├─ /set-usuarios (Gestionar usuarios)
    └─ /dashboard (Panel admin)
```

---

## 💡 RESUMEN

| Pregunta | Respuesta |
|----------|-----------|
| **¿Dónde veo servicios para contratar?** | `/servicios` + `/servicio?id=...` |
| **¿Dónde veo productos para comprar?** | `/productos` |
| **¿Dónde gestiono productos (admin)?** | `/set-productos` |
| **¿Dónde está el carrito?** | Redux (accesible desde cualquier página) |
| **¿Dónde voy a pagar?** | `/pago` (Pages.jsx) |
| **¿Los servicios son dinámicos?** | ✅ Sí (Phase 2) |
| **¿Los productos son dinámicos?** | ✅ Sí (ya existía) |
| **¿Puedo agregar servicios al carrito?** | ✅ Sí (Phase 3) |
| **¿Puedo agregar productos al carrito?** | ❌ Aún no (mejora Phase 4) |

---

**Estado Actual:**
- ✅ Servicios (profesionales) → DINÁMICO + CARRITO
- ✅ Productos → DINÁMICO (pero sin carrito)
- ⚠️ Checkout → NECESITA actualizar para usar Redux carrito

