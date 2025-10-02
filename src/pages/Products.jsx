import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { products } from '../data/products';

const ITEMS_PER_PAGE = 8; // Número de productos por página

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  // Obtener parámetros de la URL al cargar
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) setSelectedCategory(category);
    if (search) setSearchTerm(search);
  }, [searchParams]);

  // Filtrar productos (sin paginación)
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Productos paginados
  const paginatedProducts = filteredProducts.slice(0, currentPage * ITEMS_PER_PAGE);
  const maxPrice = Math.max(...products.map(p => p.price));
  const categories = [...new Set(products.map(product => product.category))];

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [searchTerm, selectedCategory, priceRange, minRating, sortBy, sortOrder]);

  // Verificar si hay más productos por cargar
  useEffect(() => {
    setHasMore(paginatedProducts.length < filteredProducts.length);
  }, [paginatedProducts.length, filteredProducts.length]);

  // Observer para carga infinita
  const lastProductElementRef = useCallback(node => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore]);

  // Función para cargar más productos
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simular delay de carga
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 800);
  }, [isLoading, hasMore]);

  // Cargar más productos al hacer scroll (fallback)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 200 && 
          !isLoading && hasMore) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, loadMore]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const params = new URLSearchParams();
    if (term) params.set('search', term);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setSortBy('name');
    setSortOrder('asc');
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedCategory ? `Categoría: ${selectedCategory}` : 
             searchTerm ? `Búsqueda: "${searchTerm}"` : 'Todos los Productos'}
          </h1>
          <p className="text-gray-600">
            Mostrando {paginatedProducts.length} de {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            {hasMore && ' (cargando más...)'}
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          
          {(searchTerm || selectedCategory || minRating > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <button 
              onClick={clearFilters}
              className="text-primary hover:text-orange-600 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar de Filtros */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            
            {/* Búsqueda */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input 
                type="text" 
                placeholder="Nombre o descripción..." 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de Precio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="0" 
                  max={maxPrice} 
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input 
                  type="range" 
                  min="0" 
                  max={maxPrice} 
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Rating Mínimo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating Mínimo</label>
              <div className="flex space-x-2">
                {[0, 1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex-1 py-1 text-sm rounded transition-colors ${
                      minRating === rating 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {rating === 0 ? 'Todos' : `⭐ ${rating}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenamiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-primary"
              >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="rating">Rating</option>
              </select>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="lg:col-span-3">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product, index) => {
                  // Referencia para el último producto
                  if (index === paginatedProducts.length - 1) {
                    return (
                      <div key={product.id} ref={lastProductElementRef}>
                        <ProductCard product={product} />
                      </div>
                    );
                  }
                  return <ProductCard key={product.id} product={product} />;
                })}
              </div>
              
              {/* Estados de carga */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[...Array(3)].map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              )}

              {/* Botón de carga manual (para móviles) */}
              {hasMore && !isLoading && (
                <div className="text-center mt-8 lg:hidden">
                  <button
                    onClick={loadMore}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                  >
                    Cargar más productos
                  </button>
                </div>
              )}

              {/* Mensaje de fin de resultados */}
              {!hasMore && filteredProducts.length > 0 && (
                <div className="text-center mt-8 py-4">
                  <p className="text-gray-500">✨ Has visto todos los productos</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
              <p className="text-gray-600 mb-6">Intenta ajustar los filtros o usar otros términos de búsqueda</p>
              <button 
                onClick={clearFilters}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}