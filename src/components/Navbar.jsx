import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { getCartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const itemCount = getCartItemsCount();

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      {/* Primera fila - Logo y búsqueda */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo y menú móvil */}
          <div className="flex items-center space-x-4">
            {/* Botón menú móvil */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">🛍️</span>
              <span className="text-xl font-bold text-white hidden sm:block">miTienda</span>
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="flex">
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-orange-600 px-6 py-2 rounded-r transition-colors flex items-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Menú derecho */}
          <div className="flex items-center space-x-4">
            {/* Menú de usuario */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded transition-colors"
                  >
                    {/* Avatar del usuario */}
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="text-sm block">Hola, {user.name.split(' ')[0]}</span>
                      <span className="text-xs text-gray-300">Cuenta y Listas</span>
                    </div>
                    <span className="text-xs text-gray-400">▼</span>
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {/* Header del dropdown */}
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-900 font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                      
                      {/* Sección de cuenta */}
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Tu cuenta</p>
                        <Link 
                          to="/profile" 
                          className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          👤 Mi perfil
                        </Link>
                        <Link 
                          to="/orders" 
                          className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          📦 Mis pedidos
                        </Link>
                        <Link 
                          to="/wishlist" 
                          className="flex items-center justify-between px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>❤️ Lista de deseos</span>
                          {wishlistCount > 0 && (
                            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                        <Link 
                          to="/addresses" 
                          className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          📍 Direcciones
                        </Link>
                      </div>

                      {/* Sección de administración */}
                      <div className="px-4 py-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Gestionar</p>
                        <Link 
                          to="/subscriptions" 
                          className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          🔔 Suscripciones
                        </Link>
                        <Link 
                          to="/security" 
                          className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          🔒 Contraseña y seguridad
                        </Link>
                      </div>

                      {/* Cerrar sesión */}
                      <div className="border-t border-gray-200 px-4 py-2">
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded font-semibold"
                        >
                          🚪 Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-sm block">Hola, identifícate</span>
                    <span className="text-xs text-gray-300">Cuenta y Listas</span>
                  </div>
                  <span className="text-xs text-gray-400">▼</span>
                </Link>
              )}
            </div>

            {/* Pedidos */}
            <Link to="/orders" className="hidden md:flex flex-col px-3 py-2 hover:bg-gray-800 rounded transition-colors">
              <span className="text-xs text-gray-300">Devoluciones</span>
              <span className="text-sm font-semibold">y Pedidos</span>
            </Link>

            {/* Carrito */}
            <Link 
              to="/cart" 
              className="flex items-center px-3 py-2 hover:bg-gray-800 rounded transition-colors relative"
            >
              <div className="relative">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <span className="ml-1 text-sm font-semibold hidden sm:block">Carrito</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Segunda fila - Navegación por categorías */}
      <div className="bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 py-2 overflow-x-auto">
            <Link to="/productos" className="flex items-center text-sm hover:text-primary transition-colors font-semibold whitespace-nowrap">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Todos
            </Link>
            <Link to="/productos?category=electronica" className="text-sm hover:text-primary transition-colors whitespace-nowrap">
              🔌 Electrónica
            </Link>
            <Link to="/productos?category=ropa" className="text-sm hover:text-primary transition-colors whitespace-nowrap">
              👕 Ropa
            </Link>
            <Link to="/productos?category=hogar" className="text-sm hover:text-primary transition-colors whitespace-nowrap">
              🏠 Hogar y Cocina
            </Link>
            <Link to="/productos?category=deportes" className="text-sm hover:text-primary transition-colors whitespace-nowrap">
              ⚽ Deportes
            </Link>
            <Link to="/productos?category=libros" className="text-sm hover:text-primary transition-colors whitespace-nowrap">
              📚 Libros
            </Link>
            <Link to="/productos?category=juegos" className="text-sm hover:text-primary transition-colors whitespace-nowrap">
              🎮 Videojuegos
            </Link>
            <Link to="/deals" className="text-sm text-red-400 hover:text-red-300 transition-colors font-semibold whitespace-nowrap">
              ⚡ Ofertas del día
            </Link>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden absolute top-full left-0 w-full bg-gray-800 border-t border-gray-700 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="space-y-3">
              {user ? (
                <>
                  <div className="text-sm font-semibold text-gray-300">Hola, {user.name}</div>
                  <Link to="/profile" className="block py-2 text-sm hover:text-primary">Mi cuenta</Link>
                  <Link to="/orders" className="block py-2 text-sm hover:text-primary">Mis pedidos</Link>
                  <Link to="/wishlist" className="flex items-center justify-between py-2 text-sm hover:text-primary">
                    <span>Lista de deseos</span>
                    {wishlistCount > 0 && (
                      <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button onClick={handleLogout} className="block py-2 text-sm text-red-400 hover:text-red-300">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link to="/login" className="block py-2 text-sm hover:text-primary font-semibold">
                  Iniciar sesión
                </Link>
              )}
              
              <div className="border-t border-gray-700 pt-3">
                <Link to="/productos" className="block py-2 text-sm hover:text-primary">Todos los productos</Link>
                <Link to="/productos?category=electronica" className="block py-2 text-sm hover:text-primary">Electrónica</Link>
                <Link to="/productos?category=ropa" className="block py-2 text-sm hover:text-primary">Ropa</Link>
                <Link to="/productos?category=hogar" className="block py-2 text-sm hover:text-primary">Hogar</Link>
                <Link to="/productos?category=deportes" className="block py-2 text-sm hover:text-primary">Deportes</Link>
                <Link to="/deals" className="block py-2 text-sm text-red-400 hover:text-red-300">Ofertas</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}