import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Deals() {
  const deals = products.filter(product => product.onSale);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con contador de tiempo (opcional) */}
      <div className="text-center mb-8 bg-gradient-to-r from-red-500 to-primary text-white py-8 rounded-2xl">
        <h1 className="text-4xl font-bold mb-4">🔥 Ofertas del Día</h1>
        <p className="text-xl mb-2">Descuentos exclusivos por tiempo limitado</p>
        <div className="flex justify-center space-x-4 text-lg">
          <div className="bg-white text-red-500 px-3 py-1 rounded font-bold">24h</div>
          <div className="bg-white text-red-500 px-3 py-1 rounded font-bold">Flash</div>
          <div className="bg-white text-red-500 px-3 py-1 rounded font-bold">50% OFF</div>
        </div>
      </div>

      {/* Contador de productos */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {deals.length} Oferta{deals.length !== 1 ? 's' : ''} Activa{deals.length !== 1 ? 's' : ''}
        </h2>
        <Link 
          to="/products" 
          className="text-primary hover:text-orange-600 font-medium"
        >
          Ver todos los productos →
        </Link>
      </div>

      {/* Grid de productos en oferta */}
      {deals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😴</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay ofertas activas</h3>
          <p className="text-gray-600 mb-6">Vuelve más tarde para descubrir nuevas ofertas</p>
          <Link 
            to="/products" 
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Explorar Productos
          </Link>
        </div>
      )}

      {/* Sección de información adicional */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-center mb-4">💡 ¿Cómo funcionan las ofertas?</h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">⏰</div>
            <h4 className="font-semibold mb-2">Tiempo Limitado</h4>
            <p className="text-gray-600">Las ofertas están disponibles por 24 horas</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🚚</div>
            <h4 className="font-semibold mb-2">Envío Gratis</h4>
            <p className="text-gray-600">Envío gratuito en todas las ofertas</p>
          </div>
          <div>
            <div className="text-3xl mb-2">↩️</div>
            <h4 className="font-semibold mb-2">Devolución Fácil</h4>
            <p className="text-gray-600">30 días para devolver si no te gusta</p>
          </div>
        </div>
      </div>
    </div>
  );
}