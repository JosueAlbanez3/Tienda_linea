import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';
import RatingStars from './RatingStars';

export default function ReviewList({ productId }) {
  const { user } = useAuth();
  const { getProductReviews, markHelpful } = useReviews();
  const [sortBy, setSortBy] = useState('recent');
  
  const reviews = getProductReviews(productId);

  // Ordenar reseñas
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'helpful':
        return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful);
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const handleHelpful = (reviewId, isHelpful) => {
    // Guardar en localStorage qué reseñas ha votado el usuario
    const votedKey = `reviewVotes_${user?.id || 'anonymous'}`;
    const votedReviews = JSON.parse(localStorage.getItem(votedKey) || '{}');
    
    if (!votedReviews[reviewId]) {
      votedReviews[reviewId] = isHelpful;
      localStorage.setItem(votedKey, JSON.stringify(votedReviews));
      markHelpful(reviewId, isHelpful);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aún no hay reseñas para este producto</p>
        <p className="text-sm text-gray-400">Sé el primero en dejar una reseña</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {reviews.length} Reseña{reviews.length !== 1 ? 's' : ''}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Ordenar por:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          >
            <option value="recent">Más recientes</option>
            <option value="helpful">Más útiles</option>
            <option value="rating-high">Mayor rating</option>
            <option value="rating-low">Menor rating</option>
          </select>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{review.userName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('es-MX')}
                </p>
              </div>
              <RatingStars rating={review.rating} readonly size="sm" />
            </div>

            {review.title && (
              <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>
            )}

            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{review.comment}</p>

            {/* Votos de utilidad */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>¿Te resultó útil?</span>
              <button
                onClick={() => handleHelpful(review.id, true)}
                className="hover:text-green-600 transition-colors"
              >
                Sí ({review.helpful})
              </button>
              <button
                onClick={() => handleHelpful(review.id, false)}
                className="hover:text-red-600 transition-colors"
              >
                No ({review.notHelpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}