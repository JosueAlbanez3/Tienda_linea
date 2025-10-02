// components/PaymentMethod.jsx
import { useCheckout } from '../context/CheckoutContext';
import { useState, useEffect } from 'react';

const PaymentMethod = ({ disableCash = false }) => {
  const { 
    paymentMethod, 
    setPaymentMethod, 
    cardData, 
    updateCardData,
    paypalEmail,
    setPaypalEmail 
  } = useCheckout();
  
  const [tempExpiry, setTempExpiry] = useState(cardData.expiry.replace(/\//g, ''));

  // Sincronizar tempExpiry cuando cambia cardData.expiry
  useEffect(() => {
    setTempExpiry(cardData.expiry.replace(/\//g, ''));
  }, [cardData.expiry]);

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    switch (field) {
      case 'number':
        // Solo números y máximo 16 dígitos
        formattedValue = value.replace(/\D/g, '').slice(0, 16);
        // Agregar espacios cada 4 dígitos
        formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
        updateCardData({ [field]: formattedValue });
        break;
      case 'expiry':
        // Manejar el campo de fecha
        const numbersOnly = value.replace(/\D/g, '').slice(0, 4);
        setTempExpiry(numbersOnly);
        
        if (numbersOnly.length === 4) {
          const formattedExpiry = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4);
          updateCardData({ [field]: formattedExpiry });
        } else {
          updateCardData({ [field]: numbersOnly });
        }
        break;
      case 'cvc':
        // Solo números y máximo 4 dígitos
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
        updateCardData({ [field]: formattedValue });
        break;
      case 'name':
        // Solo letras y espacios
        formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        updateCardData({ [field]: formattedValue });
        break;
      default:
        updateCardData({ [field]: value });
    }
  };

  const isCardDataValid = () => {
    // Debug: mostrar los valores actuales
    console.log('Validando tarjeta:', {
      number: cardData.number,
      numberLength: cardData.number.replace(/\s/g, '').length,
      name: cardData.name,
      nameLength: cardData.name.trim().length,
      expiry: cardData.expiry,
      expiryValid: /^\d{2}\/\d{2}$/.test(cardData.expiry),
      cvc: cardData.cvc,
      cvcLength: cardData.cvc.length
    });

    const isExpiryValid = /^\d{2}\/\d{2}$/.test(cardData.expiry);
    const isNumberValid = cardData.number.replace(/\s/g, '').length === 16;
    const isNameValid = cardData.name.trim().length > 0;
    const isCvcValid = cardData.cvc.length >= 3;

    console.log('Resultados validación:', {
      isNumberValid,
      isNameValid,
      isExpiryValid,
      isCvcValid,
      todosValidos: isNumberValid && isNameValid && isExpiryValid && isCvcValid
    });

    return isNumberValid && isNameValid && isExpiryValid && isCvcValid;
  };

  const isPaypalValid = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail);
    console.log('Validando PayPal:', { paypalEmail, isValid });
    return isValid;
  };

  const canProceed = () => {
    let result = false;
    
    if (paymentMethod === 'creditCard') {
      result = isCardDataValid();
    } else if (paymentMethod === 'paypal') {
      result = isPaypalValid();
    } else if (paymentMethod === 'cash') {
      result = true;
    }

    console.log('¿Puede proceder?', { paymentMethod, result });
    return result;
  };

  const handlePaymentMethodChange = (method) => {
    if (disableCash && method === 'cash') {
      return;
    }
    setPaymentMethod(method);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">2. Método de Pago</h3>
      
      {/* Selección de método de pago */}
      <div className="space-y-4 mb-6">
        {/* Tarjeta de Crédito/Débito */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="payment"
            value="creditCard"
            checked={paymentMethod === 'creditCard'}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
            className="text-primary focus:ring-primary"
          />
          <div className="ml-3 flex items-center">
            <span className="text-2xl mr-2">💳</span>
            <div>
              <span className="font-semibold">Tarjeta de Crédito/Débito</span>
              <p className="text-sm text-gray-600">Paga con tu tarjeta Visa, MasterCard o American Express</p>
            </div>
          </div>
        </label>

        {/* PayPal */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
            className="text-primary focus:ring-primary"
          />
          <div className="ml-3 flex items-center">
            <span className="text-2xl mr-2">🅿️</span>
            <div>
              <span className="font-semibold">PayPal</span>
              <p className="text-sm text-gray-600">Paga de forma segura con tu cuenta PayPal</p>
            </div>
          </div>
        </label>

        {/* Efectivo - SOLO SI NO ESTÁ DESHABILITADO */}
        {!disableCash && (
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="text-primary focus:ring-primary"
            />
            <div className="ml-3 flex items-center">
              <span className="text-2xl mr-2">💵</span>
              <div>
                <span className="font-semibold">Efectivo al Recibir</span>
                <p className="text-sm text-gray-600">Paga cuando recibas tu pedido</p>
              </div>
            </div>
          </label>
        )}

        {/* Mensaje cuando efectivo está deshabilitado */}
        {disableCash && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">💡</span>
              <div>
                <p className="text-blue-800 text-sm font-medium">
                  Para suscripciones: Solo se aceptan pagos con Tarjeta o PayPal
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  El pago en efectivo no está disponible para suscripciones
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formulario de Tarjeta de Crédito */}
      {paymentMethod === 'creditCard' && (
        <div className="space-y-4 animate-fadeIn border-t pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Tarjeta
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleCardInputChange('number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Dígitos: {cardData.number.replace(/\s/g, '').length}/16
                {cardData.number.replace(/\s/g, '').length === 16 && ' ✅'}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre en la Tarjeta
              </label>
              <input
                type="text"
                placeholder="JUAN PEREZ"
                value={cardData.name}
                onChange={(e) => handleCardInputChange('name', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                {cardData.name.trim().length > 0 ? '✅ Nombre válido' : 'Ingresa el nombre'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Expiración
              </label>
              <input
                type="text"
                placeholder="MMAA"
                value={tempExpiry}
                onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: MMAA (ej: 1225)
                {cardData.expiry && /^\d{2}\/\d{2}$/.test(cardData.expiry) && ' ✅'}
              </p>
              {cardData.expiry && (
                <p className="text-xs text-blue-600 mt-1">Formateado: {cardData.expiry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                value={cardData.cvc}
                onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Dígitos: {cardData.cvc.length}/3-4
                {cardData.cvc.length >= 3 && ' ✅'}
              </p>
            </div>
          </div>

          {/* Indicador de validación detallado */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-sm mb-2">Estado de validación:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center ${cardData.number.replace(/\s/g, '').length === 16 ? 'text-green-600' : 'text-red-600'}`}>
                {cardData.number.replace(/\s/g, '').length === 16 ? '✅' : '❌'} Número (16 dígitos)
              </div>
              <div className={`flex items-center ${cardData.name.trim().length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cardData.name.trim().length > 0 ? '✅' : '❌'} Nombre
              </div>
              <div className={`flex items-center ${/^\d{2}\/\d{2}$/.test(cardData.expiry) ? 'text-green-600' : 'text-red-600'}`}>
                {/^\d{2}\/\d{2}$/.test(cardData.expiry) ? '✅' : '❌'} Fecha (MM/AA)
              </div>
              <div className={`flex items-center ${cardData.cvc.length >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                {cardData.cvc.length >= 3 ? '✅' : '❌'} CVC (3-4 dígitos)
              </div>
            </div>
          </div>

          {/* Información de ejemplo para testing */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Para testing:</strong> Número: 4111111111111111 | Fecha: 1225 | CVC: 123 | Nombre: JUAN PEREZ
            </p>
          </div>
        </div>
      )}

      {/* Resto del código se mantiene igual... */}
      {/* Formulario de PayPal */}
      {paymentMethod === 'paypal' && (
        <div className="space-y-4 animate-fadeIn border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de PayPal
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              {isPaypalValid() ? '✅ Email válido' : 'Ingresa un email válido'}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Serás redirigido a PayPal para completar tu pago de manera segura.
            </p>
          </div>
        </div>
      )}

      {/* Información para pago en efectivo - SOLO SI NO ESTÁ DESHABILITADO */}
      {paymentMethod === 'cash' && !disableCash && (
        <div className="animate-fadeIn border-t pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ✅ Pagarás cuando recibas tu pedido. El repartidor aceptará efectivo.
            </p>
          </div>
        </div>
      )}

      {/* Información de seguridad */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Tus datos de pago están protegidos con encriptación SSL
        </div>
      </div>

      {/* Indicador general de validación */}
      <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
        canProceed() ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600'
      }`}>
        {canProceed() ? '✅ Método de pago configurado correctamente' : 'Completa la información de pago para continuar'}
      </div>
    </div>
  );
};

export default PaymentMethod;