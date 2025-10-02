import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function MobileBottomNav() {
  const { getCartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const itemCount = getCartItemsCount();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Inicio' },
    { path: '/products', icon: '📱', label: 'Productos' },
    { path: '/deals', icon: '⚡', label: 'Ofertas' },
    { path: '/wishlist', icon: '❤️', label: 'Favoritos', badge: wishlistCount },
    { path: '/cart', icon: '🛒', label: 'Carrito', badge: itemCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center p-2 text-xs transition-colors relative"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="mt-1">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}