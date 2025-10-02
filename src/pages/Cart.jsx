import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Mostrar loading mientras verifica la autenticación
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6">¡Descubre nuestros productos!</p>
        <Link 
          to="/productos" 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Ir a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tu Carrito</h1>
          <p className="text-gray-600">Hola, {user.name}. Aquí tienes tus productos seleccionados.</p>
        </div>
        <button 
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-primary font-bold">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold mx-2">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-4 p-2 rounded hover:bg-red-50 transition-colors"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-gray-600">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
          <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Productos ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span className="text-accent">Gratis</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Compra protegida por {user.name}
            </p>
          </div>
          
          <Link to="/checkout" className="w-full bg-accent text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold text-center block">
  Proceder al Pago
</Link>
          
          <Link 
            to="/products" 
            className="block text-center text-primary hover:text-orange-600 font-medium"
          >
            ← Seguir comprando
          </Link>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="text-2xl mb-2">🚚</div>
          <h4 className="font-semibold">Envío Gratis</h4>
          <p>En compras mayores a $50</p>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-semibold">Compra Segura</h4>
          <p>Datos protegidos</p>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="text-2xl mb-2">↩️</div>
          <h4 className="font-semibold">Devoluciones</h4>
          <p>30 días de garantía</p>
        </div>
      </div>
    </div>
  );
}