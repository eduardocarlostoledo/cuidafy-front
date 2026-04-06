# ✅ CHECKLIST - IMPLEMENTACIÓN WEBSOCKET CHAT

## 📋 FRONTEND - COMPLETADO ✅

- [x] Hook `useChat.js` creado con Socket.IO
- [x] Componente `Chat.jsx` reescrito
- [x] socket.io-client instalado
- [x] Build sin errores (4707 módulos)
- [x] Auto-scroll al último mensaje
- [x] Indicador de escritura
- [x] Marcar como leído automático
- [x] UI tipo WhatsApp
- [x] Manejo de errores

---

## 🔧 BACKEND - TAREAS PENDIENTES

### Paso 1: Instalar Socket.IO ⏳
```bash
cd C:\proyectos\calyaan\calyaanback
npm install socket.io
```
**Tiempo estimado:** 30 segundos
**Resultado esperado:** socket.io en package.json

---

### Paso 2: Crear `server/websocket/socketManager.js` ⏳
**Archivo nuevo** con:

```javascript
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Chat from '../models/ChatModel.js';
import Order from '../models/OrderModel.js';
import Usuario from '../models/UserModel.js';

dotenv.config();

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://calyaan.netlify.app',
        'https://calyaan.com.co',
      ],
      credentials: true,
    },
  });

  // Middleware de autenticación
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Token no proporcionado'));
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const usuario = await Usuario.findById(decoded.id);
      
      if (!usuario) {
        return next(new Error('Usuario no encontrado'));
      }

      socket.usuario = usuario;
      socket.usuarioId = usuario._id;
      socket.usuarioRol = usuario.rol;
      next();
    } catch (error) {
      next(new Error('Autenticación fallida'));
    }
  });

  // Manejadores de conexión
  io.on('connection', (socket) => {
    console.log(`✅ Usuario conectado: ${socket.usuarioId}`);

    // Evento: join-chat (unirse a sala de orden)
    socket.on('join-chat', async (data) => {
      try {
        const { orderId } = data;
        
        // Validar orden
        const orden = await Order.findById(orderId).select('cliente_id profesional_id');
        if (!orden) {
          socket.emit('error', { message: 'Orden no encontrada' });
          return;
        }

        // Validar autorización
        const esCliente = orden.cliente_id.toString() === socket.usuarioId.toString();
        const esProfesional = orden.profesional_id?.toString() === socket.usuarioId.toString();
        const esAdmin = socket.usuarioRol === 'admin';

        if (!esCliente && !esProfesional && !esAdmin) {
          socket.emit('error', { message: 'No tienes permiso para acceder a este chat' });
          return;
        }

        // Unirse a sala
        socket.join(`order-${orderId}`);
        socket.orderId = orderId;

        // Cargar historial
        const chat = await Chat.findOne({ orderId });
        if (chat) {
          socket.emit('load-messages', { messages: chat.messages });
        }

        // Notificar a otros
        socket.broadcast.to(`order-${orderId}`).emit('user-joined', {
          userId: socket.usuarioId,
          userType: socket.usuarioRol,
          timestamp: new Date(),
        });

        console.log(`📌 Usuario ${socket.usuarioId} se unió a orden ${orderId}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Evento: send-message
    socket.on('send-message', async (data) => {
      try {
        const { message, user } = data;
        const orderId = socket.orderId;

        if (!orderId) {
          socket.emit('error', { message: 'Debe unirse a un chat primero' });
          return;
        }

        // Validar mensaje
        if (!message || message.trim().length === 0 || message.length > 5000) {
          socket.emit('error', { message: 'Mensaje inválido' });
          return;
        }

        // Determinar tipo de remitente
        const senderType = socket.usuarioRol === 'admin' ? 'admin' : 
                          socket.usuarioRol === 'profesional' ? 'profesional' : 'cliente';

        // Guardar en BD
        let chat = await Chat.findOne({ orderId });
        if (!chat) {
          chat = new Chat({ orderId, messages: [] });
        }

        const nuevoMensaje = {
          user,
          userId: socket.usuarioId,
          message: message.trim(),
          senderType,
          isRead: false,
          timestamp: new Date(),
        };

        chat.messages.push(nuevoMensaje);
        await chat.save();

        // Emitir a todos en la sala
        io.to(`order-${orderId}`).emit('message-received', nuevoMensaje);

        console.log(`💬 Mensaje enviado en orden ${orderId}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Evento: typing
    socket.on('typing', () => {
      const orderId = socket.orderId;
      if (orderId) {
        socket.broadcast.to(`order-${orderId}`).emit('user-typing', {
          userId: socket.usuarioId,
          userType: socket.usuarioRol,
          timestamp: new Date(),
        });
      }
    });

    // Evento: stop-typing
    socket.on('stop-typing', () => {
      const orderId = socket.orderId;
      if (orderId) {
        socket.broadcast.to(`order-${orderId}`).emit('user-stop-typing', {
          userId: socket.usuarioId,
          userType: socket.usuarioRol,
          timestamp: new Date(),
        });
      }
    });

    // Evento: mark-as-read
    socket.on('mark-as-read', async () => {
      try {
        const orderId = socket.orderId;
        if (!orderId) return;

        const senderType = socket.usuarioRol === 'admin' ? 'admin' :
                          socket.usuarioRol === 'profesional' ? 'profesional' : 'cliente';

        const chat = await Chat.findOne({ orderId });
        if (!chat) return;

        chat.messages.forEach((msg) => {
          if (msg.senderType !== senderType) {
            msg.isRead = true;
          }
        });

        await chat.save();

        io.to(`order-${orderId}`).emit('messages-marked-as-read', {
          userId: socket.usuarioId,
          userType: socket.usuarioRol,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error marcando como leído:', error);
      }
    });

    // Evento: desconexión
    socket.on('disconnect', () => {
      const orderId = socket.orderId;
      if (orderId) {
        io.to(`order-${orderId}`).emit('user-left', {
          userId: socket.usuarioId,
          userType: socket.usuarioRol,
          timestamp: new Date(),
        });
      }
      console.log(`❌ Usuario desconectado: ${socket.usuarioId}`);
    });

    // Manejo de errores
    socket.on('error', (error) => {
      console.error('Error de socket:', error);
    });
  });

  return io;
};
```

**Tiempo estimado:** 5 minutos
**Ubicación:** `server/websocket/socketManager.js` (nuevo archivo)

---

### Paso 3: Actualizar `server/index.js` ⏳
**Cambios requeridos:**

**ANTES:**
```javascript
import express from 'express';

const app = express();
const servidor = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
```

**DESPUÉS:**
```javascript
import express from 'express';
import http from 'http';
import { initializeSocket } from './websocket/socketManager.js';

const app = express();
const httpServer = http.createServer(app);
const io = initializeSocket(httpServer);

const servidor = httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`📡 WebSocket disponible en ws://localhost:${PORT}`);
});
```

**Tiempo estimado:** 2 minutos

---

### Paso 4: Agregar Validación de Admin en `chatController.js` ⏳

**4 Funciones a modificar:**

#### Función 1: `getChatMessages` (línea ~30)
```javascript
// ANTES
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();

if (!esCliente && !esProfesional) {
  return res.status(403).json({ error: 'No tienes permiso para acceder a este chat' });
}

// DESPUÉS
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
const esAdmin = req.usuario?.rol === 'admin';

if (!esCliente && !esProfesional && !esAdmin) {
  return res.status(403).json({ error: 'No tienes permiso para acceder a este chat' });
}
```

#### Función 2: `saveChatMessage` (línea ~70)
```javascript
// ANTES
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();

if (!esCliente && !esProfesional) {
  return res.status(403).json({ error: 'No tienes permiso para enviar mensajes en este chat' });
}

// DESPUÉS
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
const esAdmin = req.usuario?.rol === 'admin';

if (!esCliente && !esProfesional && !esAdmin) {
  return res.status(403).json({ error: 'No tienes permiso para enviar mensajes en este chat' });
}
```

#### Función 3: `markMessagesAsRead` (línea ~165)
```javascript
// ANTES
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();

if (!esCliente && !esProfesional) {
  return res.status(403).json({ error: 'No tienes permiso para modificar este chat' });
}

// DESPUÉS
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
const esAdmin = req.usuario?.rol === 'admin';

if (!esCliente && !esProfesional && !esAdmin) {
  return res.status(403).json({ error: 'No tienes permiso para modificar este chat' });
}
```

#### Función 4: `getChatStats` (línea ~235)
```javascript
// ANTES
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();

if (!esCliente && !esProfesional) {
  return res.status(403).json({ error: 'No tienes permiso para acceder a estas estadísticas' });
}

// DESPUÉS
const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
const esAdmin = req.usuario?.rol === 'admin';

if (!esCliente && !esProfesional && !esAdmin) {
  return res.status(403).json({ error: 'No tienes permiso para acceder a estas estadísticas' });
}
```

**Tiempo estimado:** 3 minutos
**Archivo:** `server/controllers/chatController.js`

---

### Paso 5: Crear Directorio (si no existe) ⏳
```bash
mkdir -p C:\proyectos\calyaan\calyaanback\server\websocket
```

**Tiempo estimado:** 10 segundos

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

1. ⏳ Instalar Socket.IO (30 seg)
2. ⏳ Crear directorio websocket (10 seg)
3. ⏳ Crear socketManager.js (5 min)
4. ⏳ Actualizar index.js (2 min)
5. ⏳ Agregar validación en chatController.js (3 min)
6. ✅ Reiniciar servidor Node.js
7. 🧪 Pruebas

**Tiempo total estimado: 12 minutos**

---

## 🧪 VERIFICACIÓN DESPUÉS DE CAMBIOS

### 1. Verificar que Socket.IO está instalado
```bash
npm list socket.io
```
Debe mostrar: `socket.io@x.x.x`

### 2. Iniciar servidor
```bash
npm start
```
Debe mostrar:
```
🚀 Servidor corriendo en el puerto 4000
📡 WebSocket disponible en ws://localhost:4000
```

### 3. Verificar logs
- ✅ Usuario conectado: [ID]
- ✅ Usuario se unió a orden [ID]
- ✅ Mensaje enviado en orden [ID]

### 4. Probar en frontend
- [ ] Ir a `/resumen/[orderId]`
- [ ] Escribir mensaje
- [ ] Debe aparecer instantáneamente (no 5 seg después)
- [ ] Indicador "Escribiendo..." debe funcionar
- [ ] Admin debe ver chats de todas las órdenes

---

## ⚠️ PROBLEMAS COMUNES

| Problema | Causa | Solución |
|----------|-------|----------|
| WebSocket no conecta | Socket.IO no instalado | Ejecutar `npm install socket.io` |
| Error "CORS" | Dominio no permitido | Agregar en socketManager.js cors.origin |
| 403 Forbidden al admin | Validación sin esAdmin | Agregar esAdmin en chatController (4 lugares) |
| Mensajes no se guardan | socketManager.js no existe | Crear archivo socketManager.js |
| Servidor no inicia | index.js con errores | Verificar importación de initializeSocket |

---

## 📊 PROGRESO

| Tarea | Estado | Tiempo |
|------|--------|--------|
| npm install socket.io | ⏳ Pendiente | 30 seg |
| Crear socketManager.js | ⏳ Pendiente | 5 min |
| Actualizar index.js | ⏳ Pendiente | 2 min |
| Agregar validación admin | ⏳ Pendiente | 3 min |
| Reiniciar servidor | ⏳ Pendiente | 1 min |
| **TOTAL** | **50% Completado** | **~12 min** |

---

## 📞 CONTACTO

Si hay preguntas o problemas:
- Ver: `WEBSOCKET_IMPLEMENTATION.md`
- Ver: `WEBSOCKET_RESUMEN.md`

