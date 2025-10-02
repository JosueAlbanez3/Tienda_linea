import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      name: 'Casa',
      fullName: 'Juan Pérez',
      address: 'Calle Principal 123',
      city: 'Ciudad de México',
      state: 'CDMX',
      postalCode: '12345',
      country: 'México',
      phone: '+52 55 1234 5678',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Oficina',
      fullName: 'Juan Pérez',
      address: 'Av. Reforma 456',
      city: 'Ciudad de México',
      state: 'CDMX',
      postalCode: '67890',
      country: 'México',
      phone: '+52 55 8765 4321',
      isDefault: false
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'México',
    phone: '',
    isDefault: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Editar dirección existente
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...formData, id: editingAddress.id }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
    } else {
      // Agregar nueva dirección
      const newAddress = {
        ...formData,
        id: Date.now()
      };
      setAddresses(prev => [
        ...prev.map(addr => formData.isDefault ? { ...addr, isDefault: false } : addr),
        newAddress
      ]);
    }
    
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      type: 'home',
      name: '',
      fullName: user?.name || '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'México',
      phone: '',
      isDefault: false
    });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Direcciones</h1>
        <p className="text-gray-600 mb-8">Gestiona tus direcciones de envío</p>

        {/* Botón Agregar Dirección */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            + Agregar Nueva Dirección
          </button>
        </div>

        {/* Formulario de Dirección */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Dirección
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="home">🏠 Casa</option>
                    <option value="work">💼 Oficina</option>
                    <option value="other">📦 Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre para la dirección
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Casa, Oficina, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle, número, colonia"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Establecer como dirección principal</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {editingAddress ? 'Actualizar' : 'Guardar'} Dirección
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Direcciones */}
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center">
                    {address.type === 'home' && '🏠'}
                    {address.type === 'work' && '💼'}
                    {address.type === 'other' && '📦'}
                    <span className="ml-2">{address.name}</span>
                    {address.isDefault && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">{address.fullName}</p>
                </div>
              </div>

              <div className="space-y-2 text-gray-700">
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="text-gray-600">{address.phone}</p>
              </div>

              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                {!address.isDefault && (
                  <button
                    onClick={() => setDefault(address.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Establecer como principal
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="text-sm text-green-600 hover:text-green-800 ml-auto"
                >
                  Editar
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay direcciones guardadas</h3>
            <p className="text-gray-600 mb-6">Agrega tu primera dirección para recibir tus pedidos</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Agregar Dirección
            </button>
          </div>
        )}
      </div>
    </div>
  );
}