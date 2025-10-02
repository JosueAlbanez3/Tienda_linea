import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { products } from '../data/products';

const RecommendationContext = createContext();

export function useRecommendations() {
  return useContext(RecommendationContext);
}

export function RecommendationProvider({ children }) {
  const { user } = useAuth();
  const [userPreferences, setUserPreferences] = useState({});
  const [browseHistory, setBrowseHistory] = useState([]);

  // Guardar historial de navegación
  const addToBrowseHistory = (productId) => {
    if (user) {
      const history = JSON.parse(localStorage.getItem(`browseHistory_${user.id}`) || '[]');
      const updatedHistory = [productId, ...history.filter(id => id !== productId)].slice(0, 10);
      setBrowseHistory(updatedHistory);
      localStorage.setItem(`browseHistory_${user.id}`, JSON.stringify(updatedHistory));
    }
  };

  // Generar recomendaciones basadas en historial
  const getRecommendations = (currentProductId = null, limit = 4) => {
    if (browseHistory.length === 0) {
      // Recomendaciones por defecto (productos populares)
      return products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    }

    // Encontrar productos similares basados en categoría
    const viewedProducts = products.filter(p => browseHistory.includes(p.id));
    const preferredCategories = [...new Set(viewedProducts.map(p => p.category))];
    
    return products
      .filter(p => p.id !== currentProductId && preferredCategories.includes(p.category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  };

  // Productos frecuentemente comprados juntos
  const getFrequentlyBoughtTogether = (productId) => {
    // Simulación de datos de compras frecuentes
    const frequentlyBought = {
      1: [2, 3], // Laptop con smartphone y audífonos
      2: [1, 3], // Smartphone con laptop y audífonos
      4: [5],    // Camiseta con zapatos
      // ... más relaciones
    };

    const relatedIds = frequentlyBought[productId] || [];
    return products.filter(p => relatedIds.includes(p.id));
  };

  const value = {
    addToBrowseHistory,
    getRecommendations,
    getFrequentlyBoughtTogether,
    browseHistory
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
}