# Cuidafy — Plataforma de Cuidado y Servicios a Domicilio

<p align="center">
  <strong>Conectamos familias con profesionales de cuidado certificados.</strong><br/>
  Matching inteligente · Coordinación en tiempo real · Pagos integrados
</p>

---

## Índice

- [Visión del Producto](#visión-del-producto)
- [Problema que Resolvemos](#problema-que-resolvemos)
- [Arquitectura y Stack Tecnológico](#arquitectura-y-stack-tecnológico)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Roles y Permisos](#roles-y-permisos)
- [Instalación y Desarrollo](#instalación-y-desarrollo)
- [Variables de Entorno](#variables-de-entorno)
- [Testing](#testing)
- [Fortalezas del Proyecto](#fortalezas-del-proyecto)
- [Roadmap](#roadmap)

---

## Visión del Producto

**Cuidafy** es una plataforma digital que transforma la forma en que las familias acceden a servicios de cuidado profesional a domicilio. En lugar de búsquedas informales y acuerdos sin garantía, Cuidafy ofrece un ecosistema completo: desde la identificación de la necesidad hasta el seguimiento continuo del servicio, con pagos seguros y comunicación en tiempo real.

El objetivo es evolucionar de un modelo transaccional a un **hub de pacientes, familias y cuidadores** — donde la relación de cuidado se gestiona de forma integral, con confianza y continuidad.

---

## Problema que Resolvemos

| Problema | Cómo lo resolvemos |
|---|---|
| Encontrar cuidadores es informal e inseguro | Matching inteligente por especialidad, ubicación y disponibilidad |
| No hay forma de verificar la calidad del servicio | Perfiles profesionales con especialidades, historial y calificaciones |
| La coordinación es caótica (llamadas, mensajes dispersos) | Chat en tiempo real con timeline de caso integrado |
| Los pagos son informales y sin garantía | Integración con MercadoPago: pagos seguros con trazabilidad |
| No hay seguimiento post-contratación | Sistema de casos con estados, historial y panel de seguimiento |
| La gestión operativa es manual | Dashboard administrativo con métricas, logs y herramientas de gestión |

---

## Arquitectura y Stack Tecnológico

### Frontend (este repositorio)

| Capa | Tecnología | Propósito |
|---|---|---|
| **Framework** | React 18 | UI declarativa y componentizada |
| **Build** | Vite 4 | Dev server rápido, builds optimizados |
| **Estado** | Redux Toolkit | Estado global predecible y escalable |
| **Routing** | React Router v6 | Navegación SPA con rutas protegidas |
| **UI Components** | Ant Design 5 + TailwindCSS 3 | Componentes robustos + utilidades de estilo |
| **Animaciones** | Framer Motion | Transiciones fluidas y microinteracciones |
| **Tiempo real** | Socket.IO Client | Chat bidireccional y notificaciones |
| **Pagos** | MercadoPago SDK | Checkout y procesamiento de pagos |
| **Auth** | JWT + Google OAuth | Autenticación segura multi-proveedor |
| **Calendario** | React Big Calendar | Gestión visual de agendas |
| **PDF** | React PDF Renderer | Generación de documentos client-side |
| **Testing** | Cypress | Tests end-to-end |

### Backend (repositorio separado)

| Capa | Tecnología |
|---|---|
| **Runtime** | Node.js + Express |
| **Base de datos** | MongoDB + Mongoose |
| **Autenticación** | JWT |
| **Pagos** | MercadoPago API |
| **Comunicación** | Socket.IO, EmailJS, Twilio |
| **Facturación** | Siigo |

---

## Funcionalidades Principales

### Para Familias y Pacientes
- **Flujo de cuidado guiado** — Formulario multi-paso que captura necesidad, urgencia, frecuencia, turnos y modalidad
- **Matching inteligente** — Algoritmo que puntúa profesionales según especialidad, ubicación y disponibilidad
- **Perfiles de cuidadores** — Vista detallada con experiencia, especialidades y reviews
- **Chat en tiempo real** — Comunicación directa con el profesional asignado, con indicadores de escritura y lectura
- **Historial de servicios** — Seguimiento completo de servicios contratados
- **Programa de fidelidad y referidos** — Incentivos por uso recurrente y recomendaciones

### Para Profesionales de Cuidado
- **Gestión de disponibilidad** — Carga de horarios por fecha con bloques configurables
- **Calendario profesional** — Vista visual de agenda y reservas
- **Inbox de casos** — Panel de casos asignados con estados y acciones
- **Perfil profesional** — Edición de especialidades, descripción y áreas de cobertura
- **Historial y liquidaciones** — Registro de servicios realizados y estado de pagos

### Para Administradores
- **Dashboard con KPIs** — Métricas clave del negocio en tiempo real
- **Gestión de usuarios** — CRUD de clientes, profesionales y administradores
- **Gestión de reservas** — Calendario y listado de reservas con filtros
- **Transacciones y facturación** — Control financiero con tablas Ant Design
- **Liquidaciones** — Cálculo y seguimiento de pagos a profesionales
- **Logs de actividad** — Auditoría de operaciones del sistema
- **Herramientas operativas** — Configuración de productos y parámetros

---

## Estructura del Proyecto

```
src/
├── api/                    # Llamadas API específicas
├── assets/                 # Imágenes y recursos estáticos
├── components/             # Componentes reutilizables
│   ├── care/               # Flujo de cuidado (intake, matching, inbox)
│   ├── mercadopago/        # Integración de pagos
│   └── ReservatioSteps/    # Pasos de reserva
├── config/                 # Configuración (Axios + interceptores JWT)
├── data/                   # Datos estáticos y catálogos
├── guards/                 # Protección de rutas (Auth + Role)
├── helpers/                # Lógica de negocio y utilidades
│   ├── auth/               # Gestión de sesión
│   ├── admin/              # Utilidades administrativas
│   ├── chat/               # Helpers de chat
│   ├── Components/         # Componentes auxiliares (Loading, etc.)
│   └── Logic/              # Roles, estados, cálculos
├── hooks/                  # Custom hooks
│   ├── useChat.js          # WebSocket + mensajería
│   ├── useDisponibilidades.js  # Disponibilidades con cache (5 min)
│   ├── useCheckout.js      # Flujo de pago
│   └── useCarrito.js       # Carrito de servicios
├── layout/                 # Layouts por contexto
│   ├── ServicesLayout.jsx  # Layout público
│   ├── ProfileLayout.jsx   # Layout autenticado
│   └── DashboardLayout.jsx # Layout administrativo
├── pages/                  # Páginas y vistas
│   ├── care/               # Flujo de cuidado
│   ├── private/            # Área autenticada
│   │   ├── dashboard/      # Panel administrativo
│   │   └── professional/   # Área profesional
│   └── ...                 # Páginas públicas
├── redux/                  # Estado global
│   ├── store.js            # Configuración del store
│   ├── api.js              # Llamadas API centralizadas
│   └── features/           # Slices (auth, ordenes, profesionales, etc.)
├── App.jsx                 # Definición de rutas
├── main.jsx                # Entry point
└── index.css               # Estilos globales
```

---

## Roles y Permisos

| Rol | Acceso | Descripción |
|---|---|---|
| **Cliente** | Área pública + perfil + casos + chat | Familias y pacientes que buscan servicios de cuidado |
| **Profesional** | Área pública + perfil profesional + agenda + casos | Cuidadores certificados que ofrecen servicios |
| **Administrador** | Todo + dashboard + gestión + logs | Operadores de la plataforma con control total |

La protección de rutas se implementa mediante:
- **AuthGuard** — Verifica autenticación activa (JWT válido)
- **RoleGuard** — Verifica que el rol del usuario coincida con el requerido por la ruta

---

## Instalación y Desarrollo

### Prerrequisitos

- Node.js >= 16
- npm o yarn
- Backend de Cuidafy corriendo (ver repositorio backend)

### Setup

```bash
# Clonar el repositorio
git clone https://github.com/eduardocarlostoledo/cuidafy-front.git
cd cuidafy-front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales correspondientes

# Iniciar en modo desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Variables de Entorno

| Variable | Descripción |
|---|---|
| `VITE_APP_API_URL` | URL base del backend API |
| `VITE_APP_BACK` | URL del servidor backend |
| `VITE_APP_GOOGLE_ID` | Client ID de Google OAuth |
| `VITE_APP_MERCADOPAGO` | Public Key de MercadoPago |
| `VITE_APP_MERCADOPAGO_ACCESS_TOKEN` | Access Token de MercadoPago |

> **Nota:** Nunca commitear credenciales reales. Usar `.env.example` como plantilla sin valores sensibles.

---

## Testing

```bash
# Abrir Cypress para tests E2E
npm run cypress:open
```

---

## Fortalezas del Proyecto

**Arquitectura sólida**
- Separación clara de responsabilidades: layouts, guards, hooks, helpers, redux slices
- Componentes modulares y reutilizables
- Custom hooks que encapsulan lógica compleja (chat, disponibilidades, checkout)

**Seguridad**
- Autenticación JWT con interceptores Axios automáticos
- Control de acceso basado en roles (RBAC) en frontend
- Rutas protegidas con guards encadenables
- Rama de seguridad activa en backend (OWASP)

**Experiencia de usuario**
- Flujo de cuidado guiado que simplifica una decisión compleja
- Chat en tiempo real con indicadores de estado
- Layouts adaptativos por rol de usuario
- Caching inteligente para reducir llamadas innecesarias al API

**Escalabilidad**
- Redux Toolkit con slices desacoplados
- Vite para builds rápidos y tree-shaking eficiente
- Estructura de carpetas que escala con el crecimiento de features

**Integraciones productivas**
- MercadoPago para pagos seguros en LATAM
- Google OAuth para onboarding sin fricción
- Socket.IO para comunicación bidireccional en tiempo real
- React Big Calendar para gestión visual de agendas

---

## Roadmap

- [ ] Plantilla de disponibilidad semanal recurrente para profesionales
- [ ] Sistema de calificaciones y reviews post-servicio
- [ ] Notificaciones push
- [ ] Split de pagos automático (comisión plataforma + pago profesional)
- [ ] Dashboard de métricas para profesionales
- [ ] App mobile (React Native)
- [ ] Integración con calendario externo (Google Calendar)

---

<p align="center">
  <sub>Desarrollado por <strong>Toledo Consultora IT</strong></sub><br/>
  <sub>© 2024 — Cuidafy. Todos los derechos reservados.</sub>
</p>
