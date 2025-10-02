import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.id === parseInt(id));
    setOrder(foundOrder);
  }, [id]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedido no encontrado</h2>
        <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header de confirmación */}
        <div className="text-center mb-8 bg-green-50 rounded-2xl p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pedido Confirmado!</h1>
          <p className="text-gray-600">Gracias por tu compra, {user?.name}</p>
          <p className="text-sm text-gray-500 mt-2">Número de pedido: #{order.id}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Detalles del pedido */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Detalles del Pedido</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Estado del Pedido</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Fecha de Pedido</h3>
                <p>{new Date(order.date).toLocaleDateString('es-MX')}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Entrega Estimada</h3>
                <p>{new Date(order.estimatedDelivery).toLocaleDateString('es-MX')}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Método de Pago</h3>
                <p className="capitalize">
                  {order.paymentMethod === 'creditCard' ? 'Tarjeta de Crédito/Débito' :
                   order.paymentMethod === 'paypal' ? 'PayPal' : 'Efectivo al Recibir'}
                </p>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="ml-3">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-600 text-xs">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dirección de envío */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p><strong>Nombre:</strong> {order.shippingAddress.fullName}</p>
              <p><strong>Dirección:</strong> {order.shippingAddress.address}</p>
            </div>
            <div>
              <p><strong>Ciudad:</strong> {order.shippingAddress.city}</p>
              <p><strong>CP:</strong> {order.shippingAddress.postalCode}</p>
              <p><strong>Teléfono:</strong> {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="text-center mt-8 space-x-4">
          <Link 
            to="/orders" 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 inline-block"
          >
            Ver Mis Pedidos
          </Link>
          <Link 
            to="/products" 
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 inline-block"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}