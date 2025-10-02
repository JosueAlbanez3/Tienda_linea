import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full relative">
      {/* Badges */}
      {product.onSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
          🔥 OFERTA
        </div>
      )}
      
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-bold z-10">
          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
          inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
        } hover:scale-110 transition-transform`}
        title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {inWishlist ? '❤️' : '🤍'}
      </button>

      <Link to={`/product/${product.id}`} className="text-center flex-grow flex flex-col">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-lg text-gray-800 hover:text-primary transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-center mb-2">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>

          {/* Precios */}
          <div className="mt-auto">
            {hasDiscount ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                </div>
                <p className="text-xs text-green-600 font-semibold">
                  Ahorras ${(product.originalPrice - product.price).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-primary">${product.price}</p>
            )}
          </div>
          
          {product.stock < 5 && product.stock > 0 && (
            <p className="text-xs text-primary font-semibold mt-2">
              ⚡ Últimas {product.stock} unidades
            </p>
          )}
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
});

export default ProductCard;