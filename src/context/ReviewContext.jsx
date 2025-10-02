import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReviewContext = createContext();

export function useReviews() {
  return useContext(ReviewContext);
}

export function ReviewProvider({ children }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  // Cargar reseñas desde localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem('productReviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Guardar reseñas en localStorage
  useEffect(() => {
    localStorage.setItem('productReviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId, rating, comment, title = '') => {
    if (!user) return { success: false, error: 'Debes iniciar sesión para dejar una reseña' };

    const newReview = {
      id: Date.now(),
      productId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      rating,
      title,
      comment,
      date: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0
    };

    setReviews(prev => [newReview, ...prev]);
    return { success: true, review: newReview };
  };

  const getProductReviews = (productId) => {
    return reviews.filter(review => review.productId === productId)
                 .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getProductRating = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / productReviews.length).toFixed(1);
  };

  const getUserReview = (productId) => {
    if (!user) return null;
    return reviews.find(review => review.productId === productId && review.userId === user.id);
  };

  const markHelpful = (reviewId, isHelpful) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpful: isHelpful ? review.helpful + 1 : review.helpful,
            notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ));
  };

  const deleteReview = (reviewId) => {
    if (!user) return false;
    
    const review = reviews.find(r => r.id === reviewId);
    if (review && review.userId === user.id) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      return true;
    }
    return false;
  };

  const value = {
    reviews,
    addReview,
    getProductReviews,
    getProductRating,
    getUserReview,
    markHelpful,
    deleteReview
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}