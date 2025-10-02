// context/CheckoutContext.jsx - Versión actualizada
import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export function useCheckout() {
  return useContext(CheckoutContext);
}

export function CheckoutProvider({ children }) {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'México',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [order, setOrder] = useState(null);
  
  // Nuevos estados para datos de pago
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [paypalEmail, setPaypalEmail] = useState('');

  const updateShippingAddress = (address) => {
    setShippingAddress(prev => ({ ...prev, ...address }));
  };

  const updateCardData = (newCardData) => {
    setCardData(prev => ({ ...prev, ...newCardData }));
  };

  const placeOrder = (cartItems, total) => {
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total,
      shippingAddress,
      paymentMethod,
      paymentDetails: paymentMethod === 'creditCard' ? { 
        last4: cardData.number.slice(-4),
        type: 'card'
      } : { 
        email: paypalEmail,
        type: 'paypal'
      },
      status: 'processing',
      date: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    setOrder(newOrder);
    
    // Guardar en historial de pedidos
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
    
    return newOrder;
  };

  const value = {
    shippingAddress,
    paymentMethod,
    order,
    cardData,
    paypalEmail,
    updateShippingAddress,
    setPaymentMethod,
    updateCardData,
    setPaypalEmail,
    placeOrder
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}