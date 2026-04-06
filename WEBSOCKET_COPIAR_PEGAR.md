# 🔧 CAMBIOS EXACTOS PARA COPIAR/PEGAR

## ARCHIVO 1: `server/websocket/socketManager.js` (NUEVO)

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

---

## ARCHIVO 2: `server/index.js` - REEMPLAZAR INICIO

**ENCONTRAR:**
```javascript
import express from "express";
// ... más imports

const app = express();

// ... configuración

const servidor = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
```

**REEMPLAZAR CON:**
```javascript
import express from "express";
import http from "http";
import { initializeSocket } from "./websocket/socketManager.js";
// ... más imports (mantener los que ya existen)

const app = express();

// ... configuración (mantener igual)

const httpServer = http.createServer(app);
const io = initializeSocket(httpServer);

const servidor = httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`📡 WebSocket disponible en ws://localhost:${PORT}`);
});
```

---

## ARCHIVO 3: `server/controllers/chatController.js` - CAMBIOS EN 4 FUNCIONES

### CAMBIO 1: En `getChatMessages` (Buscar esta parte)

**ENCONTRAR:**
```javascript
        // Validar autorización - solo cliente o profesional pueden ver el chat
        const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
        const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
        
        if (!esCliente && !esProfesional) {
            return res.status(403).json({ error: 'No tienes permiso para acceder a este chat' });
        }
```

**REEMPLAZAR CON:**
```javascript
        // Validar autorización - cliente, profesional o admin pueden ver el chat
        const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
        const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
        const esAdmin = req.usuario?.rol === 'admin';
        
        if (!esCliente && !esProfesional && !esAdmin) {
            return res.status(403).json({ error: 'No tienes permiso para acceder a este chat' });
        }
```

### CAMBIO 2: En `saveChatMessage` (Buscar esta parte)

**ENCONTRAR:**
```javascript
    const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
    const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
    
    if (!esCliente && !esProfesional) {
      return res.status(403).json({ error: 'No tienes permiso para enviar mensajes en este chat' });
    }
```

**REEMPLAZAR CON:**
```javascript
    const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
    const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
    const esAdmin = req.usuario?.rol === 'admin';
    
    if (!esCliente && !esProfesional && !esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para enviar mensajes en este chat' });
    }
```

### CAMBIO 3: En `markMessagesAsRead` (Buscar esta parte)

**ENCONTRAR:**
```javascript
    // Validar autorización
    const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
    const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
    
    if (!esCliente && !esProfesional) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este chat' });
    }
```

**REEMPLAZAR CON:**
```javascript
    // Validar autorización
    const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
    const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
    const esAdmin = req.usuario?.rol === 'admin';
    
    if (!esCliente && !esProfesional && !esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este chat' });
    }
```

### CAMBIO 4: En `getChatStats` (Buscar esta parte)

**ENCONTRAR:**
```javascript
    // Validar autorización
    const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
    const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
    
    if (!esCliente && !esProfesional) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a estas estadísticas' });
    }
```

**REEMPLAZAR CON:**
```javascript
    // Validar autorización
    const esCliente = orden.cliente_id.toString() === usuarioId?.toString();
    const esProfesional = orden.profesional_id?.toString() === usuarioId?.toString();
    const esAdmin = req.usuario?.rol === 'admin';
    
    if (!esCliente && !esProfesional && !esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a estas estadísticas' });
    }
```

---

## INSTALACIÓN DE DEPENDENCIA

```bash
npm install socket.io
```

---

## VERIFICACIÓN

Después de hacer los cambios:

1. ```bash
   npm start
   ```
   Debe mostrar:
   ```
   🚀 Servidor corriendo en el puerto 4000
   📡 WebSocket disponible en ws://localhost:4000
   ```

2. Si hay error, revisar que:
   - Archivo `socketManager.js` existe en `server/websocket/`
   - Importación `import { initializeSocket }` en index.js
   - socket.io está en package.json

3. En browser (F12 → Console):
   - Debe decir: `✅ Usuario conectado: [id]`
   - Debe decir: `📌 Usuario [id] se unió a orden [id]`

