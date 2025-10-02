import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useReviews } from '../context/ReviewContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecommendations } from '../context/RecommendationContext';
import { products } from '../data/products';
import RatingStars from '../components/RatingStars';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ProductCard from '../components/ProductCard';
import LazyImage from '../components/LazyImage';
import { useState, useEffect } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { getProductRating, getProductReviews, getUserReview } = useReviews();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToBrowseHistory, getRecommendations, getFrequentlyBoughtTogether } = useRecommendations();
  
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const product = products.find(p => p.id === parseInt(id));
  const productRating = getProductRating(product?.id);
  const reviews = getProductReviews(product?.id);
  const userReview = getUserReview(product?.id);
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Agregar al historial y obtener recomendaciones
  useEffect(() => {
    if (product) {
      addToBrowseHistory(product.id);
    }
  }, [product, addToBrowseHistory]);

  const recommendations = getRecommendations(product?.id);
  const frequentlyBought = getFrequentlyBoughtTogether(product?.id);

  const handleWishlistClick = () => {
    if (!product) return;
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-screen flex items-center justify-center">
        <div>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <Link 
            to="/productos"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 inline-block"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Información principal del producto */}
        <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
          {/* Imágenes */}
          <div className="flex justify-center relative">
            <div className="relative">
              {/* Wishlist button */}
              <button
                onClick={handleWishlistClick}
                className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all ${
                  inWishlist 
                    ? 'bg-red-500 text-white transform scale-110' 
                    : 'bg-white text-gray-600 hover:scale-110'
                }`}
                title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {inWishlist ? '❤️' : '🤍'}
              </button>

              {/* Badge de oferta */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}

              <LazyImage
                src={product.image}
                alt={product.name}
                className="rounded-lg w-full max-w-md object-cover transition-transform duration-300 hover:scale-105"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
          
          {/* Información */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-tight">
              {product.name}
            </h1>
            
            {/* Rating y reviews */}
            <div className="flex items-center mb-4 flex-wrap">
              <RatingStars rating={parseFloat(productRating)} readonly />
              <span className="text-base lg:text-lg text-gray-600 ml-2">
                {productRating} ({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})
              </span>
              <button 
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="ml-4 text-primary hover:text-orange-600 text-sm underline"
              >
                Ver todas
              </button>
            </div>

            {/* Precio */}
            <div className="mb-6">
              {hasDiscount ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-4 flex-wrap">
                    <span className="text-3xl lg:text-4xl font-bold text-primary">${product.price}</span>
                    <span className="text-xl lg:text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                  </div>
                  <p className="text-green-600 font-semibold">
                    ¡Ahorras ${(product.originalPrice - product.price).toFixed(2)}!
                  </p>
                </div>
              ) : (
                <p className="text-3xl lg:text-4xl font-bold text-primary">${product.price}</p>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-lg">✅</span>
                  <div>
                    <p className="text-green-600 font-semibold">En stock</p>
                    {product.stock < 10 && (
                      <p className="text-orange-500 text-sm">¡Solo {product.stock} disponibles!</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-red-500 font-semibold flex items-center">
                  <span className="text-lg mr-2">❌</span>
                  Producto agotado
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-4 mb-6">
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg transform hover:scale-105 active:scale-95"
              >
                {product.stock > 0 ? '🛒 Añadir al carrito' : 'Agotado'}
              </button>
            </div>

            {/* Envío y garantía */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-lg mr-2">🚚</span>
                <div>
                  <p className="font-semibold">Envío gratis</p>
                  <p className="text-xs">En 3-5 días</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-lg mr-2">↩️</span>
                <div>
                  <p className="font-semibold">Devolución fácil</p>
                  <p className="text-xs">30 días garantía</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de información */}
        <div className="border-t">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 min-w-max py-4 px-6 font-semibold whitespace-nowrap ${
                activeTab === 'description' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 Descripción
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 min-w-max py-4 px-6 font-semibold whitespace-nowrap ${
                activeTab === 'reviews' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⭐ Reseñas ({reviews.length})
            </button>
            {frequentlyBought.length > 0 && (
              <button
                onClick={() => setActiveTab('bought-together')}
                className={`flex-1 min-w-max py-4 px-6 font-semibold whitespace-nowrap ${
                  activeTab === 'bought-together' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🛍️ Comprar juntos
              </button>
            )}
          </div>

          {/* Contenido de las tabs */}
          <div className="p-6 lg:p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Descripción del Producto</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-lg">📊 Características</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Categoría:</span>
                        <span className="font-semibold capitalize">{product.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Rating promedio:</span>
                        <span className="font-semibold">{productRating} ⭐</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Disponibilidad:</span>
                        <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-lg">🛡️ Garantía</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Envío gratuito en compras mayores a $50
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Devolución en 30 días sin complicaciones
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Soporte técnico 24/7
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div id="reviews-section" className="space-y-8">
                {/* Resumen de ratings */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Calificación General</h3>
                    <div className="text-6xl font-bold text-primary mb-2">{productRating}</div>
                    <RatingStars rating={parseFloat(productRating)} readonly size="lg" />
                    <p className="text-gray-600 mt-2">Basado en {reviews.length} reseñas</p>
                  </div>
                  
                  {/* Distribución de ratings */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold mb-4 text-lg">Distribución de Calificaciones</h4>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        
                        return (
                          <div key={rating} className="flex items-center">
                            <span className="w-12 text-sm font-semibold">{rating} ⭐</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                              <div 
                                className="bg-yellow-400 h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="w-8 text-sm text-right font-semibold">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Botón para escribir reseña */}
                {!userReview && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                    >
                      ✍️ Escribir una Reseña
                    </button>
                  </div>
                )}

                {/* Formulario de reseña */}
                {(showReviewForm || userReview) && (
                  <ReviewForm 
                    productId={product.id}
                    existingReview={userReview}
                    onReviewSubmitted={() => {
                      setShowReviewForm(false);
                    }}
                  />
                )}

                {/* Lista de reseñas */}
                <ReviewList productId={product.id} />
              </div>
            )}

            {activeTab === 'bought-together' && frequentlyBought.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Productos que suelen comprarse juntos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {frequentlyBought.map(relatedProduct => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de productos recomendados */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">📈 Productos Relacionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(recProduct => (
              <ProductCard key={recProduct.id} product={recProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Sección de frecuentemente comprados juntos */}
      {frequentlyBought.length > 0 && activeTab !== 'bought-together' && (
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-orange-100 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">💡 ¿Necesitas algo más?</h3>
          <p className="text-gray-600 mb-4">Otros clientes también compraron estos productos:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {frequentlyBought.slice(0, 4).map(product => (
              <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                <p className="text-primary font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}