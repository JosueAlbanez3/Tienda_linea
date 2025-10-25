// src/services/chatService.js
const CHAT_API_URL = 'https://api.openai.com/v1/chat/completions'; // Ejemplo con OpenAI

export const chatService = {
  async sendMessage(message, context = {}) {
    try {
      const response = await fetch('/api/chat/proxy', { // Usa un proxy para evitar CORS
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Eres un asistente virtual de una tienda online. 
              Ayuda a los usuarios con preguntas sobre productos, envíos, devoluciones, 
              y cualquier duda que tengan. Sé amable y profesional.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 150
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw new Error('Error al conectar con el servicio de chat');
    }
  }
};