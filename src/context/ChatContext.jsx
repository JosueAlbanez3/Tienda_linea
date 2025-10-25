// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    
    try {
      // Aquí integrarías con tu API de IA
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: user?.id,
          context: 'ecommerce'
        })
      });

      const data = await response.json();
      
      setChatHistory(prev => [...prev, {
        userMessage: message,
        botResponse: data.response,
        timestamp: new Date()
      }]);

      return data.response;
    } catch (error) {
      console.error('Error en chat:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  const value = {
    chatHistory,
    sendMessage,
    isLoading,
    clearHistory
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};