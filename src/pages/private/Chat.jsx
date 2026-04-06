import React, { useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import clienteAxios from '../../config/axios';
import ModalLogin from '../../components/ModalLogin';
import { useChat } from '../../hooks/useChat';
import { getAuthToken, getStoredProfile } from '../../helpers/auth/getSessionData';
import { renderMessageContent } from '../../helpers/chat/renderMessageContent.jsx';

const Chat = ({ id }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [modal, setModal] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  const usuario = getStoredProfile();
  const token = getAuthToken();

  const {
    messages,
    isTyping,
    error,
    sendMessage,
    markAsRead,
    emitTyping,
    emitStopTyping,
  } = useChat(id, token);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const handleModalLogin = () => {
    setModal((prev) => !prev);
  };

  const handleSendMessage = () => {
    try {
      if (!currentMessage.trim()) {
        return;
      }

      sendMessage(currentMessage, usuario?.nombre || 'Cliente');
      setCurrentMessage('');
      emitStopTyping();
    } catch (requestError) {
      console.error('Error saving message:', requestError);
      if (requestError.response?.status === 401) {
        setModal(true);
      }
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      swal({
        title: 'Error',
        text: 'La geolocalizacion no esta disponible en este navegador',
        icon: 'error',
        button: 'Aceptar',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const mapLink = `https://www.google.com/maps/place/${latitude},${longitude}`;
      sendMessage(
        `Ubicacion compartida: ${mapLink}`,
        usuario?.nombre || 'Cliente'
      );
      setCurrentMessage('');
    });
  };

  const handleSendMessageNotificacion = async () => {
    try {
      const profile = getStoredProfile() || {};
      await clienteAxios.post('/api/chat/notificacion/', {
        id,
        email: profile.email,
      });

      swal({
        title: 'Notificacion enviada',
        text: 'Se ha enviado una notificacion al usuario para que se comunique contigo.',
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (requestError) {
      console.error('Error sending notification:', requestError);
      swal({
        title: 'Error',
        text: 'No se pudo enviar la notificacion',
        icon: 'error',
        button: 'Aceptar',
      });
    }
  };

  const handleInputChange = (event) => {
    setCurrentMessage(event.target.value);
    emitTyping();

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      emitStopTyping();
    }, 2000);

    setTypingTimeout(timeout);
  };

  return (
    <div className="flex h-1/2 flex-col p-4">
      {error && (
        <div className="mb-3 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex-1 overflow-auto rounded border border-gray-300 bg-gray-50 p-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No hay mensajes aun. Inicia la conversacion.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 ${
                message.senderType === 'cliente' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-xs rounded-lg px-3 py-2 ${
                  message.senderType === 'cliente'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-300 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="mb-1 text-xs font-semibold">
                  {message.user}
                  {message.isRead && ' OK'}
                </p>
                <p className="text-sm break-words">
                  {renderMessageContent(message.message)}
                </p>
                <p className="mt-1 text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="mb-3 text-left">
            <div className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-3 py-2 text-gray-800">
              <p className="text-xs italic">Escribiendo...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="mb-3">
        <input
          className="w-full rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={currentMessage}
          onChange={handleInputChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Escribir mensaje y presionar Enter..."
        />
      </div>

      <div className="p-1">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className="flex-1 rounded bg-blue-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 sm:px-4"
          >
            Enviar
          </button>

          <button
            onClick={shareLocation}
            className="flex-1 rounded bg-green-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700 sm:px-4"
          >
            Compartir ubicacion
          </button>

          <button
            onClick={handleSendMessageNotificacion}
            className="flex-1 rounded bg-orange-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-700 sm:px-4"
          >
            Enviar notificacion
          </button>
        </div>

        <p className="py-2 text-center text-xs text-gray-600 sm:text-sm">
          Haz clic en <strong>Enviar notificacion</strong> para alertar al otro usuario.
        </p>
      </div>

      {modal && <ModalLogin handleModalLogin={handleModalLogin} />}
    </div>
  );
};

export default Chat;
