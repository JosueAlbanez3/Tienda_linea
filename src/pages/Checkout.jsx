import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PaymentMethod from '../components/PaymentMethod';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { 
    shippingAddress, 
    paymentMethod, 
    updateShippingAddress, 
    placeOrder,
    cardData,
    paypalEmail,
    updatePaymentMethod // ← Necesitamos esta función para restringir métodos
  } = useCheckout();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [orderType, setOrderType] = useState('products');
  const [subscriptionData, setSubscriptionData] = useState(null);

  // Detectar si es una suscripción y restringir métodos de pago
  useEffect(() => {
    if (location.state?.type === 'subscription') {
      setOrderType('subscription');
      setSubscriptionData(location.state.subscriptionData);
      
      // Si el método actual es efectivo, cambiarlo automáticamente
      if (paymentMethod === 'cash') {
        updatePaymentMethod('creditCard'); // Cambiar a tarjeta por defecto
      }
    }
  }, [location.state, paymentMethod, updatePaymentMethod]);

  // Calcular totales según el tipo de orden
  const calculateTotals = () => {
    if (orderType === 'subscription' && subscriptionData) {
      const subtotal = subscriptionData.price;
      // SUSCRIPCIONES SIN IMPUESTOS
      const total = subtotal;
      
      return {
        subtotal,
        shipping: 0,
        tax: 0, // ← Cero impuestos para suscripciones
        total
      };
    } else {
      // Orden normal de productos
      const subtotal = getCartTotal();
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.16;
      const total = subtotal + shipping + tax;
      
      return { subtotal, shipping, tax, total };
    }
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const validateStep1 = () => {
    const newErrors = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Nombre completo requerido';
    if (!shippingAddress.address.trim()) newErrors.address = 'Dirección requerida';
    if (!shippingAddress.city.trim()) newErrors.city = 'Ciudad requerida';
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = 'Código postal requerido';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Teléfono requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    // Para suscripciones, no permitir efectivo
    if (orderType === 'subscription' && paymentMethod === 'cash') {
      return false;
    }

    if (paymentMethod === 'creditCard') {
      return (
        cardData.number.replace(/\s/g, '').length === 16 &&
        cardData.name.trim().length > 0 &&
        cardData.expiry.length === 5 &&
        cardData.cvc.length >= 3
      );
    } else if (paymentMethod === 'paypal') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail);
    } else if (paymentMethod === 'cash') {
      return true; // Solo para productos normales
    }
    return false;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = () => {
    if (orderType === 'subscription') {
      const order = {
        id: Date.now().toString(),
        type: 'subscription',
        subscriptionData,
        total,
        date: new Date().toISOString()
      };
      navigate(`/order-confirmation/${order.id}`, { state: { orderType: 'subscription' } });
    } else {
      const order = placeOrder(cartItems, total);
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    }
  };

  if (orderType === 'products' && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6">Agrega productos antes de proceder al checkout</p>
        <Link to="/productos" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600">
          Ir a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center w-full max-w-2xl">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Dirección de Envío */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">1. Dirección de Envío</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => updateShippingAddress({ fullName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => updateShippingAddress({ phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => updateShippingAddress({ address: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => updateShippingAddress({ city: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => updateShippingAddress({ postalCode: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-orange-600 mt-6 font-semibold transition-colors"
              >
                Continuar al Pago
              </button>
            </div>
          )}

          {/* Step 2: Método de Pago - ACTUALIZADO PARA SUSCRIPCIONES */}
          {currentStep === 2 && (
            <div>
              <PaymentMethod 
                // Pasar prop para deshabilitar efectivo en suscripciones
                disableCash={orderType === 'subscription'}
              />
              
              {/* Mensaje informativo para suscripciones */}
              {orderType === 'subscription' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">💡</span>
                    <p className="text-blue-800 text-sm">
                      <strong>Para suscripciones:</strong> Solo se aceptan pagos con Tarjeta o PayPal. 
                      El pago en efectivo no está disponible para suscripciones.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                >
                  Regresar
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!validateStep2()}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    validateStep2() 
                      ? 'bg-primary text-white hover:bg-orange-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Revisar {orderType === 'subscription' ? 'Suscripción' : 'Pedido'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Revisar Pedido/Suscripción */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">
                3. Revisar tu {orderType === 'subscription' ? 'Suscripción' : 'Pedido'}
              </h3>
              
              <div className="space-y-6">
                {/* Dirección de Envío */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2 text-lg">Dirección de Envío</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{shippingAddress.fullName}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                    <p className="text-gray-600">{shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Método de Pago */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2 text-lg">Método de Pago</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {paymentMethod === 'creditCard' && (
                      <div>
                        <p className="font-medium">💳 Tarjeta de Crédito/Débito</p>
                        <p className="text-sm text-gray-600">
                          Terminada en {cardData.number.slice(-4)} • {cardData.name}
                        </p>
                      </div>
                    )}
                    {paymentMethod === 'paypal' && (
                      <div>
                        <p className="font-medium">🅿️ PayPal</p>
                        <p className="text-sm text-gray-600">{paypalEmail}</p>
                      </div>
                    )}
                    {paymentMethod === 'cash' && (
                      <div>
                        <p className="font-medium">💵 Efectivo al Recibir</p>
                        <p className="text-sm text-gray-600">Pagarás cuando recibas tu pedido</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Productos o Suscripción */}
                <div>
                  <h4 className="font-semibold mb-2 text-lg">
                    {orderType === 'subscription' ? 'Detalles de Suscripción' : 'Productos'}
                  </h4>
                  
                  {orderType === 'subscription' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-lg text-blue-800">
                          Suscripción {subscriptionData?.planName}
                        </h5>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          🔔 Suscripción
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p><strong>Plan:</strong> {subscriptionData?.planName}</p>
                        <p><strong>Duración:</strong> {
                          subscriptionData?.plan === 'monthly' ? '1 mes' :
                          subscriptionData?.plan === 'quarterly' ? '3 meses' : '1 año'
                        }</p>
                        <p><strong>Beneficios:</strong> Envío gratis, Descuentos exclusivos, Acceso prioritario</p>
                        <p><strong>Renovación:</strong> Automática al finalizar el período</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-3 border-b">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                              {item.onSale && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  En oferta
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="font-semibold text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                >
                  Regresar
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-accent text-white py-3 rounded-lg hover:bg-green-600 font-semibold transition-colors"
                >
                  {orderType === 'subscription' ? 'Confirmar Suscripción' : 'Realizar Pedido'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary - ACTUALIZADO SIN IMPUESTOS PARA SUSCRIPCIONES */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
          <h3 className="text-xl font-bold mb-4">
            {orderType === 'subscription' ? 'Resumen de Suscripción' : 'Resumen del Pedido'}
          </h3>
          
          <div className="space-y-3 mb-4">
            {orderType === 'subscription' ? (
              <>
                <div className="flex justify-between">
                  <span>Suscripción {subscriptionData?.planName}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                {/* NO MOSTRAR IMPUESTOS PARA SUSCRIPCIONES */}
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (16%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </>
            )}
            
            <hr className="my-2" />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {orderType === 'subscription' ? (
            <div className="bg-green-50 p-3 rounded-lg text-sm border border-green-200 mb-4">
              <p className="font-semibold text-green-800">🎁 Beneficios incluidos:</p>
              <ul className="text-green-700 mt-1 space-y-1">
                <li>• Envío gratis en todos tus pedidos</li>
                <li>• Descuentos exclusivos hasta 30%</li>
                <li>• Acceso prioritario a nuevas colecciones</li>
                <li>• Sin cargos de impuestos adicionales</li>
              </ul>
            </div>
          ) : (
            shipping === 0 ? (
              <p className="text-green-600 text-sm mb-4 bg-green-50 p-2 rounded-lg">
                ✅ ¡Envío gratis aplicado!
              </p>
            ) : (
              <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-2 rounded-lg">
                Agrega <span className="font-semibold">${(50 - subtotal).toFixed(2)}</span> más para envío gratis
              </p>
            )
          )}

          <div className="bg-blue-50 p-3 rounded-lg text-sm border border-blue-200">
            <p className="font-semibold text-blue-800">📦 Estimado de entrega:</p>
            <p className="text-blue-700">3-5 días hábiles</p>
          </div>

          {/* Información de seguridad */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Compra 100% segura • SSL Encriptado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}