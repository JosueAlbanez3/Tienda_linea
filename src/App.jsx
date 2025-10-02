import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Deals from './pages/Deals';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import Subscriptions from './pages/Subscriptions';
import Security from './pages/Security';
import AdminPanel from './pages/AdminPanel'; // ← Agrega esta importación
import NotificationContainer from './components/NotificationContainer';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* NUEVAS RUTAS AGREGADAS */}
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/security" element={<Security />} />
        
        {/* RUTA DEL PANEL DE ADMINISTRACIÓN */}
        <Route path="/admin" element={<AdminPanel />} />
        
        <Route path="*" element={
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
            <p className="text-gray-600 mb-6">Página no encontrada</p>
            <a href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Volver al Inicio
            </a>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;