import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const SubscriptionContext = createContext();

// Proveedor del contexto
export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar suscripción desde localStorage al inicializar
  useEffect(() => {
    const savedSubscription = localStorage.getItem('userSubscription');
    if (savedSubscription) {
      try {
        setSubscription(JSON.parse(savedSubscription));
      } catch (error) {
        console.error('Error parsing subscription data:', error);
        localStorage.removeItem('userSubscription');
      }
    }
    setIsLoading(false);
  }, []);

  // Guardar suscripción en localStorage cuando cambie
  useEffect(() => {
    if (subscription) {
      localStorage.setItem('userSubscription', JSON.stringify(subscription));
    } else {
      localStorage.removeItem('userSubscription');
    }
  }, [subscription]);

  // Suscribirse a un plan
  const subscribe = (plan) => {
    const newSubscription = {
      plan,
      startDate: new Date().toISOString(),
      status: 'active',
      // La fecha de fin depende del plan (1 mes, 3 meses, etc.)
      endDate: calculateEndDate(plan),
    };
    setSubscription(newSubscription);
    return newSubscription;
  };

  // Cancelar suscripción
  const cancelSubscription = () => {
    if (subscription) {
      const updatedSubscription = {
        ...subscription,
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      };
      setSubscription(updatedSubscription);
    }
  };

  // Renovar suscripción
  const renewSubscription = () => {
    if (subscription) {
      const updatedSubscription = {
        ...subscription,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: calculateEndDate(subscription.plan),
        cancelledAt: null
      };
      setSubscription(updatedSubscription);
    }
  };

  // Calcular fecha de fin basado en el plan
  const calculateEndDate = (plan) => {
    const endDate = new Date();
    switch (plan) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }
    return endDate.toISOString();
  };

  // Verificar si la suscripción está activa
  const isSubscriptionActive = () => {
    if (!subscription || subscription.status !== 'active') return false;
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    return now < endDate;
  };

  // Verificar si la suscripción está por vencer (en los próximos 7 días)
  const isSubscriptionExpiring = () => {
    if (!isSubscriptionActive()) return false;
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const daysUntilExpiry = (endDate - now) / (1000 * 60 * 60 * 24);
    
    return daysUntilExpiry <= 7;
  };

  const value = {
    subscription,
    isLoading,
    subscribe,
    cancelSubscription,
    renewSubscription,
    isSubscriptionActive,
    isSubscriptionExpiring
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;