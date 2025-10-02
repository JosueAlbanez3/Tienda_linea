import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const { userProfile, updateProfile, addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, getDefaultAddress } = useUserProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: ''
  });
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'México',
    phone: '',
    instructions: ''
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Cargar datos del perfil
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || user?.name?.split(' ')[0] || '',
        lastName: userProfile.lastName || user?.name?.split(' ')[1] || '',
        phone: userProfile.phone || '',
        birthDate: userProfile.birthDate || ''
      });
    }
  }, [userProfile, user]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    if (isAddingAddress) {
      addAddress(addressForm);
    }
    
    setAddressForm({
      fullName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'México',
      phone: '',
      instructions: ''
    });
    setIsAddingAddress(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Cuenta</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    👤 Mi Perfil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'addresses' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    📍 Direcciones
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'security' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    🔒 Seguridad
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'preferences' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    ⚙️ Preferencias
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Pestaña: Perfil */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Información Personal</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Editar Perfil
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                      <p className="text-sm text-gray-500 mt-1">El email no se puede cambiar</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                        Guardar Cambios
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <p className="text-lg">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-lg">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="text-lg">{formData.phone || 'No especificado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                        <p className="text-lg">{formData.birthDate || 'No especificada'}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Miembro desde</label>
                      <p className="text-lg">{new Date(user.createdAt).toLocaleDateString('es-MX')}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pestaña: Direcciones */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Mis Direcciones</h2>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                  >
                    + Agregar Dirección
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddressSubmit} className="mb-6 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Nueva Dirección</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Dirección"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Ciudad"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Código Postal"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">
                        Guardar Dirección
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map(address => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{address.fullName}</h3>
                        {address.id === getDefaultAddress()?.id && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Principal</span>
                        )}
                      </div>
                      <p className="text-gray-600">{address.address}</p>
                      <p className="text-gray-600">{address.city}, {address.postalCode}</p>
                      <p className="text-gray-600">{address.phone}</p>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => setDefaultAddress(address.id)}
                          className="text-primary hover:text-orange-600 text-sm"
                        >
                          Establecer como principal
                        </button>
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {addresses.length === 0 && !isAddingAddress && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tienes direcciones guardadas</p>
                  </div>
                )}
              </div>
            )}

            {/* Otras pestañas... */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Seguridad</h2>
                <p className="text-gray-600">Funcionalidad de seguridad en desarrollo...</p>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Preferencias</h2>
                <p className="text-gray-600">Preferencias de usuario en desarrollo...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}