import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Bienvenido a <span className="text-primary">MiTienda</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Descubre los mejores productos con envío gratis
        </p>
        <Link 
          to="/productos"  // Cambiado de "/products" a "/productos"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold"
        >
          Comprar Ahora
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 text-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-primary font-bold text-xl">${product.price}</p>
              <Link 
  to={`/productos/${product.id}`}  // ← CAMBIADO A "/productos"
  className="inline-block mt-3 text-secondary hover:underline"
>
  Ver detalles
</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}