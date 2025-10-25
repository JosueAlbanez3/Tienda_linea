// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Cargar historial del localStorage al iniciar
  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      try {
        const parsedMessages = JSON.parse(savedChat);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        localStorage.removeItem('chatHistory');
      }
    }
  }, []);

  // Guardar en localStorage cuando cambien los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensaje de bienvenida inicial solo si no hay historial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy con nuestros productos?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Respuestas inteligentes basadas en palabras clave
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Base de conocimiento para la tienda
    const responses = {
      producto: [
        "Tenemos una amplia variedad de productos. ¿Buscas algo específico? Puedo ayudarte a encontrar lo que necesitas.",
        "Puedes explorar nuestros productos en la sección 'Productos'. ¿Te interesa alguna categoría en particular?",
        "Todos nuestros productos tienen garantía y envío gratuito. ¿Qué tipo de producto buscas?"
      ],
      precio: [
        "Nuestros precios son competitivos y frecuentemente tenemos ofertas. ¿Te interesa algún producto específico para consultar el precio?",
        "Puedes ver los precios actualizados en cada página de producto. También tenemos sección de ofertas con descuentos especiales.",
        "¿Quieres saber el precio de algún producto en particular? Estoy aquí para ayudarte."
      ],
      envio: [
        "¡Ofrecemos envío gratuito en todos los pedidos superiores a $50! El tiempo de entrega es de 3-5 días hábiles.",
        "Hacemos envíos a todo el país. El costo y tiempo de entrega dependen de tu ubicación y el tamaño del pedido.",
        "Puedes hacer seguimiento de tu pedido desde tu cuenta una vez que sea despachado."
      ],
      devolucion: [
        "Aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en perfecto estado.",
        "Para devoluciones, contacta a nuestro servicio al cliente o visita la sección 'Mis Pedidos' en tu perfil.",
        "Las devoluciones son gratuitas si el producto presenta algún defecto de fábrica."
      ],
      pago: [
        "Aceptamos tarjetas de crédito, débito, PayPal y transferencias bancarias. Todas las transacciones son seguras.",
        "Puedes guardar tus métodos de pago en tu perfil para compras futuras más rápidas.",
        "¿Tienes alguna duda específica sobre métodos de pago? Estoy aquí para ayudarte."
      ],
      cuenta: [
        "Puedes crear una cuenta gratis para guardar tus pedidos, favoritos y datos de envío.",
        "En tu cuenta podrás ver tu historial de compras, gestionar suscripciones y actualizar tu información personal.",
        "¿Necesitas ayuda para crear una cuenta o recuperar tu contraseña?"
      ],
      oferta: [
        "¡Revisa nuestra sección 'Ofertas' para encontrar los mejores descuentos! Actualizamos las promociones semanalmente.",
        "Tenemos ofertas especiales para suscriptores. ¿Te gustaría saber más sobre nuestros planes de suscripción?",
        "No te pierdas nuestras ofertas flash que publicamos cada viernes."
      ],
      garantia: [
        "Todos nuestros productos tienen garantía del fabricante. La duración varía según el producto.",
        "La garantía cubre defectos de fabricación. Para hacerla válida, conserva tu ticket de compra.",
        "¿Tienes algún problema con un producto? Podemos ayudarte con el proceso de garantía."
      ],
      contacto: [
        "Puedes contactarnos por WhatsApp al +1-234-567-8900, email: soporte@tienda.com, o nuestro chat en vivo.",
        "Nuestro servicio al cliente está disponible 24/7 por chat y de 9 AM a 6 PM por teléfono.",
        "¿En qué puedo ayudarte a contactar con el equipo adecuado?"
      ]
    };

    // Detectar palabras clave y seleccionar respuesta
    let selectedCategory = 'general';
    
    if (message.includes('producto') || message.includes('item') || message.includes('artículo')) {
      selectedCategory = 'producto';
    } else if (message.includes('precio') || message.includes('costo') || message.includes('valor')) {
      selectedCategory = 'precio';
    } else if (message.includes('envío') || message.includes('entrega') || message.includes('enviar')) {
      selectedCategory = 'envio';
    } else if (message.includes('devolución') || message.includes('devolver') || message.includes('cambio')) {
      selectedCategory = 'devolucion';
    } else if (message.includes('pago') || message.includes('tarjeta') || message.includes('pag')) {
      selectedCategory = 'pago';
    } else if (message.includes('cuenta') || message.includes('registro') || message.includes('login')) {
      selectedCategory = 'cuenta';
    } else if (message.includes('oferta') || message.includes('descuento') || message.includes('promoción')) {
      selectedCategory = 'oferta';
    } else if (message.includes('garantía') || message.includes('garantia') || message.includes('reparación')) {
      selectedCategory = 'garantia';
    } else if (message.includes('contacto') || message.includes('soporte') || message.includes('ayuda')) {
      selectedCategory = 'contacto';
    }

    // Respuestas generales si no se detecta categoría específica
    const generalResponses = [
      "Entiendo tu pregunta. ¿Podrías darme más detalles para poder ayudarte mejor?",
      "¡Excelente pregunta! Nuestro equipo está siempre disponible para asistirte con eso.",
      "Puedo ayudarte con información sobre productos, precios, envíos y más. ¿Qué te gustaría saber específicamente?",
      "Gracias por tu consulta. Para darte la mejor respuesta, ¿podrías contarme un poco más?",
      "Estoy aquí para ayudarte con cualquier duda sobre nuestra tienda. ¿En qué aspecto necesitas asistencia?"
    ];

    const categoryResponses = responses[selectedCategory] || generalResponses;
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    return randomResponse;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simular delay de respuesta más realista
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const botResponse = getAIResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  // Función para limpiar el historial
  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    
    // Agregar mensaje de bienvenida después de limpiar
    const welcomeMessage = {
      id: 1,
      text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy con nuestros productos?",
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const quickQuestions = [
    "¿Cuánto cuesta el envío?",
    "¿Aceptan devoluciones?",
    "¿Qué métodos de pago aceptan?",
    "¿Tienen garantía?"
  ];

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 animate-bounce"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Asistente Virtual</h3>
              <p className="text-xs opacity-80">En línea • Tienda</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Botón para limpiar historial */}
              {messages.length > 1 && (
                <button
                  onClick={clearChatHistory}
                  className="text-white hover:text-gray-200 transition-colors text-xs"
                  title="Limpiar historial"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${message.isBot ? 'text-left' : 'text-right'}`}
              >
                <div
                  className={`inline-block max-w-xs p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-white border border-gray-200 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Preguntas rápidas */}
            {messages.length === 1 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="block w-full text-left p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;