// pages/AdminPanel.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';

export default function AdminPanel() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Redirigir si no es administrador
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Cargar datos
  useEffect(() => {
    loadProducts();
    loadOrders();
    loadUsers();
  }, []);

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(savedProducts);
  };

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  };

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    // Filtrar para no mostrar el admin en la lista
    const customers = savedUsers.filter(u => u.role !== 'admin');
    setUsers(customers);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Estadísticas calculadas
  const stats = [
    { 
      name: 'Ventas Totales', 
      value: `$${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}`, 
      change: '+18%', 
      icon: '💰' 
    },
    { 
      name: 'Órdenes Totales', 
      value: orders.length.toString(), 
      change: '+12%', 
      icon: '📦' 
    },
    { 
      name: 'Productos Activos', 
      value: products.length.toString(), 
      change: '+5%', 
      icon: '📱' 
    },
    { 
      name: 'Clientes Registrados', 
      value: users.length.toString(), 
      change: '+8%', 
      icon: '👥' 
    }
  ];

  // Funciones de gestión de productos
  const deleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('add-product');
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Actualizar producto existente
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...productData, rating: editingProduct.rating || 0 }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } else {
      // Crear nuevo producto
      const newProduct = {
        id: Date.now(),
        ...productData,
        rating: 0,
        createdAt: new Date().toISOString()
      };
      
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
    
    // Regresar a la lista de productos
    setActiveTab('products');
    setEditingProduct(null);
  };

  // Funciones de gestión de órdenes
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const viewOrderDetails = (order) => {
    alert(`Detalles de la orden #${order.id}\nCliente: ${order.customerName || 'N/A'}\nTotal: $${order.total?.toFixed(2) || '0.00'}\nEstado: ${order.status || 'pending'}\nProductos: ${order.items?.length || 0}`);
  };

  // Funciones de gestión de usuarios
  const deleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      // Actualizar localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedAllUsers = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedAllUsers));
    }
  };

  const editUser = (user) => {
    const newName = prompt('Nuevo nombre del usuario:', user.name);
    if (newName && newName.trim() !== '') {
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, name: newName.trim() } : u
      );
      setUsers(updatedUsers);
      
      // Actualizar localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedAllUsers = allUsers.map(u => 
        u.id === user.id ? { ...u, name: newName.trim() } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedAllUsers));
    }
  };

  // Función para exportar reportes
  const exportReport = () => {
    const reportData = {
      fecha: new Date().toISOString(),
      estadisticas: stats,
      totalProductos: products.length,
      totalOrdenes: orders.length,
      totalUsuarios: users.length,
      ventasTotales: orders.reduce((sum, order) => sum + (order.total || 0), 0)
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h2>
        <p className="text-gray-600">No tienes permisos de administrador.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🛍️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold">Administrador</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Ir a Tienda
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navegación */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-8 overflow-x-auto">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: '📊' },
            { id: 'products', name: 'Productos', icon: '📦' },
            { id: 'orders', name: 'Órdenes', icon: '📋' },
            { id: 'users', name: 'Usuarios', icon: '👥' },
            { id: 'reports', name: 'Reportes', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingProduct(null);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Contenido del Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Órdenes Recientes y Acciones Rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Órdenes Recientes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Órdenes Recientes</h3>
                  <span className="text-sm text-gray-500">{orders.length} órdenes</span>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {orders.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-semibold">#{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} productos • {order.customerName || 'Cliente'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total?.toFixed(2) || '0.00'}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hay órdenes recientes</p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Ver Todas las Órdenes
                </button>
              </div>

              {/* Acciones Rápidas */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab('add-product')}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-2xl mb-2">➕</span>
                    <span className="text-sm font-medium">Agregar Producto</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-2xl mb-2">👥</span>
                    <span className="text-sm font-medium">Gestionar Usuarios</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-2xl mb-2">📊</span>
                    <span className="text-sm font-medium">Generar Reporte</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors">
                    <span className="text-2xl mb-2">⚙️</span>
                    <span className="text-sm font-medium">Configuración</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestión de Productos */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Gestión de Productos</h3>
              <button
                onClick={() => setActiveTab('add-product')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                + Agregar Producto
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Producto</th>
                    <th className="text-left py-3">Precio</th>
                    <th className="text-left py-3">Stock</th>
                    <th className="text-left py-3">Categoría</th>
                    <th className="text-left py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                            }}
                          />
                          <div>
                            <span className="font-medium block">{product.name}</span>
                            <span className="text-sm text-gray-500 line-clamp-1">{product.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold">${product.price}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' : 
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} unidades
                        </span>
                      </td>
                      <td className="py-3 capitalize">{product.category}</td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => editProduct(product)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <p className="text-gray-500 text-center py-8">No hay productos registrados</p>
              )}
            </div>
          </div>
        )}

        {/* Formulario para Agregar/Editar Producto */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setEditingProduct(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Volver a Productos
              </button>
            </div>

            <ProductForm 
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setActiveTab('products');
                setEditingProduct(null);
              }}
            />
          </div>
        )}

        {/* Gestión de Órdenes */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Gestión de Órdenes</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Orden ID</th>
                    <th className="text-left py-3">Cliente</th>
                    <th className="text-left py-3">Total</th>
                    <th className="text-left py-3">Estado</th>
                    <th className="text-left py-3">Fecha</th>
                    <th className="text-left py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 font-semibold">#{order.id}</td>
                      <td className="py-3">{order.customerName || 'Cliente'}</td>
                      <td className="py-3 font-semibold">${order.total?.toFixed(2) || '0.00'}</td>
                      <td className="py-3">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="completed">Completado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                      <td className="py-3 text-sm">
                        {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3">
                        <button 
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="text-gray-500 text-center py-8">No hay órdenes registradas</p>
              )}
            </div>
          </div>
        )}

        {/* Gestión de Usuarios */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Usuario</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Registro</th>
                    <th className="text-left py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{user.avatar || '👤'}</span>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => editUser(user)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
              )}
            </div>
          </div>
        )}

        {/* Reportes */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Reportes y Análisis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Resumen General</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total de Productos:</span>
                    <span className="font-semibold">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Órdenes:</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Usuarios:</span>
                    <span className="font-semibold">{users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ventas Totales:</span>
                    <span className="font-semibold">${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Productos Más Vendidos</h4>
                <div className="space-y-2">
                  {products.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="truncate">{product.name}</span>
                      <span className="text-gray-600 text-sm">0 ventas</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={exportReport}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Exportar Reporte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}