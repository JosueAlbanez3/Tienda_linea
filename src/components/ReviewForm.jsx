import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';
import RatingStars from './RatingStars';

export default function ReviewForm({ productId, onReviewSubmitted, existingReview }) {
  const { user } = useAuth();
  const { addReview, deleteReview } = useReviews();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }

    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    if (comment.trim().length < 10) {
      alert('La reseña debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = addReview(productId, rating, comment.trim(), title.trim());
      
      if (result.success) {
        setRating(0);
        setTitle('');
        setComment('');
        if (onReviewSubmitted) {
          onReviewSubmitted(result.review);
        }
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (existingReview && window.confirm('¿Estás seguro de que quieres eliminar tu reseña?')) {
      deleteReview(existingReview.id);
      if (onReviewSubmitted) {
        onReviewSubmitted(null);
      }
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Inicia sesión para dejar una reseña</p>
        <a href="/login" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          Iniciar Sesión
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {existingReview ? 'Editar tu reseña' : 'Escribe una reseña'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tu calificación *</label>
          <RatingStars rating={rating} onRatingChange={setRating} />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título de la reseña (opcional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Ej: Excelente producto, muy recomendado"
            maxLength="100"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Tu reseña *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Comparte tu experiencia con este producto..."
            required
            minLength="10"
            maxLength="1000"
          />
          <p className="text-sm text-gray-500 mt-1">{comment.length}/1000 caracteres</p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : existingReview ? 'Actualizar Reseña' : 'Enviar Reseña'}
          </button>
          
          {existingReview && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Eliminar Reseña
            </button>
          )}
        </div>
      </form>
    </div>
  );
}