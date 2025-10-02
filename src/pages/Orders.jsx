import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(userOrders);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'En camino';
      case 'processing': return 'Procesando';
      case 'cancelled': return 'Cancelado';
      default: return 'Pendiente';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Aún no tienes pedidos</h2>
          <p className="text-gray-600 mb-6">Cuando realices un pedido, aparecerá aquí</p>
          <Link 
            to="/products" 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Comenzar a Comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>
                  <p className="text-gray-600 text-sm">
                    Realizado el {new Date(order.date).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Entrega estimada:</p>
                  <p>{new Date(order.estimatedDelivery).toLocaleDateString('es-MX')}</p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p className="text-primary font-bold">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {order.items.slice(0, 3).map(item => (
                      <img 
                        key={item.id} 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded border"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-sm font-semibold">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to={`/order-confirmation/${order.id}`}
                    className="text-primary hover:text-orange-600 font-semibold"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}