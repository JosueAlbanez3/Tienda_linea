import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

export default function Subscriptions() {
  const { 
    subscription, 
    isLoading, 
    isSubscriptionActive,
    cancelSubscription,
    renewSubscription,
    subscribe
  } = useSubscription();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Precios de los planes
  const planPrices = {
    monthly: 9.99,
    quarterly: 24.99,
    yearly: 89.99
  };

  const planNames = {
    monthly: 'Mensual',
    quarterly: 'Trimestral', 
    yearly: 'Anual'
  };

  const handleSubscribeClick = (planType) => {
    setSelectedPlan(planType);
    setShowConfirmation(true);
  };

  const confirmSubscription = () => {
    if (selectedPlan) {
      // Crear la suscripción primero
      const newSubscription = subscribe(selectedPlan);
      
      // Redirigir al checkout con los datos de la suscripción
      navigate('/checkout', {
        state: {
          type: 'subscription',
          subscriptionData: {
            plan: selectedPlan,
            planName: planNames[selectedPlan],
            price: planPrices[selectedPlan],
            subscriptionId: newSubscription.id || Date.now().toString()
          }
        }
      });
    }
  };

  const cancelSubscriptionProcess = () => {
    setShowConfirmation(false);
    setSelectedPlan(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando suscripciones...</p>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = isSubscriptionActive();

  // Si no tiene suscripciones activas
  if (!hasActiveSubscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">🔔</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            No tienes suscripciones activas
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Descubre nuestros planes de suscripción y disfruta de beneficios exclusivos
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Plan Mensual */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Mensual</h3>
              <p className="text-3xl font-bold text-primary mb-4">
                ${planPrices.monthly}
                <span className="text-sm text-gray-500">/mes</span>
              </p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✅ Envío gratis</li>
                <li>✅ Descuentos exclusivos</li>
                <li>✅ Acceso prioritario</li>
              </ul>
              <button 
                onClick={() => handleSubscribeClick('monthly')}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Suscribirse
              </button>
            </div>
            
            {/* Plan Trimestral */}
            <div className="bg-white border-2 border-primary rounded-lg p-6 shadow-sm relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trimestral</h3>
              <p className="text-3xl font-bold text-primary mb-4">
                ${planPrices.quarterly}
                <span className="text-sm text-gray-500">/3 meses</span>
              </p>
              <p className="text-green-600 font-semibold mb-4">¡Ahorras 16%!</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✅ Envío gratis</li>
                <li>✅ Descuentos exclusivos</li>
                <li>✅ Acceso prioritario</li>
                <li>✅ Contenido premium</li>
              </ul>
              <button 
                onClick={() => handleSubscribeClick('quarterly')}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Suscribirse
              </button>
            </div>
            
            {/* Plan Anual */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Anual</h3>
              <p className="text-3xl font-bold text-primary mb-4">
                ${planPrices.yearly}
                <span className="text-sm text-gray-500">/año</span>
              </p>
              <p className="text-green-600 font-semibold mb-4">¡Ahorras 25%!</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✅ Envío gratis</li>
                <li>✅ Descuentos exclusivos</li>
                <li>✅ Acceso prioritario</li>
                <li>✅ Contenido premium</li>
                <li>✅ Soporte premium</li>
              </ul>
              <button 
                onClick={() => handleSubscribeClick('yearly')}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Suscribirse
              </button>
            </div>
          </div>

          <Link 
            to="/productos"
            className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold inline-block"
          >
            🚀 Explorar Productos
          </Link>
        </div>

        {/* Modal de Confirmación */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Confirmar Suscripción</h3>
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que quieres suscribirte al plan{' '}
                <strong>
                  {planNames[selectedPlan]} (${planPrices[selectedPlan]})
                </strong>?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold">Resumen del plan:</p>
                <ul className="text-sm text-gray-600 mt-2">
                  <li>• {planNames[selectedPlan]} - ${planPrices[selectedPlan]}</li>
                  <li>• Pago único al momento de la suscripción</li>
                  <li>• Renovación automática al finalizar el período</li>
                  <li>• Cancelación en cualquier momento</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Serás redirigido al proceso de pago para completar tu suscripción.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={cancelSubscriptionProcess}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSubscription}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ... (el resto del código para cuando ya tiene suscripción activa se mantiene igual)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Suscripciones</h1>
        <p className="text-gray-600 mb-8">Gestiona tu suscripción activa</p>

        {/* Tarjeta de suscripción activa */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">✅</span>
                <h2 className="text-xl font-semibold text-gray-800">
                  Suscripción {planNames[subscription.plan]}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-semibold text-green-600">Activa</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de inicio</p>
                  <p className="font-semibold">
                    {new Date(subscription.startDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Próxima renovación</p>
                  <p className="font-semibold">
                    {new Date(subscription.endDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-semibold">{planNames[subscription.plan]}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Activa
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tiempo restante</span>
              <span>
                {Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))} días
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(10, Math.min(100, 
                    ((new Date(subscription.endDate) - new Date()) / 
                     (new Date(subscription.endDate) - new Date(subscription.startDate))) * 100
                  ))}%`
                }}
              ></div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={renewSubscription}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              🔄 Renovar Ahora
            </button>
            
            <button
              onClick={cancelSubscription}
              className="border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors font-semibold"
            >
              🚫 Cancelar Suscripción
            </button>
            
            <Link 
              to="/productos"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              📊 Explorar Productos
            </Link>
          </div>
        </div>

        {/* Historial de suscripción */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Historial de Suscripción</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-semibold">Suscripción activada</p>
                <p className="text-sm text-gray-600">
                  {new Date(subscription.startDate).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Activa
              </span>
            </div>
            
            {subscription.cancelledAt && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-semibold">Suscripción cancelada</p>
                  <p className="text-sm text-gray-600">
                    {new Date(subscription.cancelledAt).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  Cancelada
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}