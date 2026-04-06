import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { getAuthToken } from '../helpers/auth/getSessionData';

/**
 * Hook personalizado para manejar chat en tiempo real con WebSocket
 * Conecta con Socket.IO y maneja eventos de mensajes, typing indicators, etc.
 * 
 * @param {string} orderId - ID de la orden del chat
 * @param {string} token - Token JWT para autenticación
 * @returns {Object} - { messages, sendMessage, isTyping, onlineUsers, error, markAsRead, emitTyping, emitStopTyping }
 */
export const useChat = (orderId, token) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState(null);

  // Obtener token de localStorage si no se proporciona
  const authToken = token || getAuthToken();
  const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000';
  

  useEffect(() => {
    if (!orderId || !authToken) return;

    try {
      // Conectar al servidor WebSocket
      const newSocket = io(apiUrl, {
        auth: {
          token: authToken,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Unirse al chat
      newSocket.emit('join-chat', { orderId });

      // Escuchar mensajes nuevos
      newSocket.on('message-received', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Escuchar cuando alguien está escribiendo
      newSocket.on('user-typing', (data) => {
        setIsTyping(true);
      });

      // Escuchar cuando alguien dejó de escribir
      newSocket.on('user-stop-typing', (data) => {
        setIsTyping(false);
      });

      // Escuchar cuando un usuario se une
      newSocket.on('user-joined', (data) => {
        console.log(`${data.userType} se unió al chat`);
        setOnlineUsers((prev) => [...prev, data.userId]);
      });

      // Escuchar cuando un usuario se va
      newSocket.on('user-left', (data) => {
        console.log(`${data.userType} salió del chat`);
        setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
      });

      // Escuchar notificación de lectura
      newSocket.on('messages-marked-as-read', (data) => {
        console.log(`${data.userType} marcó mensajes como leídos`);
      });

      // Escuchar errores
      newSocket.on('error', (errorData) => {
        console.error('Socket error:', errorData);
        setError(errorData.message || 'Error en la conexión');
      });

      // Escuchar desconexión
      newSocket.on('disconnect', () => {
        console.log('Desconectado del servidor WebSocket');
      });

      setSocket(newSocket);

      // Marcar como leído automáticamente después de 2 segundos
      const readTimer = setTimeout(() => {
        if (newSocket) {
          newSocket.emit('mark-as-read');
        }
      }, 2000);

      return () => {
        clearTimeout(readTimer);
        newSocket.disconnect();
      };
    } catch (err) {
      console.error('Error conectando WebSocket:', err);
      setError('Error conectando al servidor');
    }
  }, [orderId, authToken, apiUrl]);

  const sendMessage = useCallback(
    (message, user) => {
      if (socket && message.trim()) {
        socket.emit('send-message', {
          message: message.trim(),
          user,
        });
      }
    },
    [socket]
  );

  const markAsRead = useCallback(() => {
    if (socket) {
      socket.emit('mark-as-read');
    }
  }, [socket]);

  const emitTyping = useCallback(() => {
    if (socket) {
      socket.emit('typing');
    }
  }, [socket]);

  const emitStopTyping = useCallback(() => {
    if (socket) {
      socket.emit('stop-typing');
    }
  }, [socket]);

  return {
    messages,
    isTyping,
    onlineUsers,
    error,
    sendMessage,
    markAsRead,
    emitTyping,
    emitStopTyping,
  };
};
