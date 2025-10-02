import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Opcional: remover de wishlist al agregar al carrito
    // removeFromWishlist(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(product => addToCart(product));
    // clearWishlist(); // Opcional: limpiar wishlist después de mover todo
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu lista de deseos está vacía</h2>
        <p className="text-gray-600 mb-6">Agrega productos que te gusten para verlos aquí</p>
        <Link 
          to="/products" 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mi Lista de Deseos</h1>
          <p className="text-gray-600">{wishlistItems.length} producto{wishlistItems.length !== 1 ? 's' : ''} en tu lista</p>
        </div>
        
        <div className="space-x-2">
          <button 
            onClick={handleMoveAllToCart}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Agregar Todo al Carrito
          </button>
          <button 
            onClick={clearWishlist}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Limpiar Lista
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/product/${product.id}`} className="block">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover hover:scale-105 transition-transform"
              />
            </Link>
            
            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
              </div>
              
              <p className="text-2xl font-bold text-primary mb-4">${product.price}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
                >
                  Agregar al Carrito
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Quitar de la lista"
                >
                  ❌
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Agregado el {new Date(product.addedAt).toLocaleDateString('es-MX')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}