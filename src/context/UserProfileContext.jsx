import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserProfileContext = createContext();

export function useUserProfile() {
  return useContext(UserProfileContext);
}

export function UserProfileProvider({ children }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  // Cargar perfil y direcciones
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`userProfile_${user.id}`);
      const savedAddresses = localStorage.getItem(`userAddresses_${user.id}`);
      const savedDefaultAddress = localStorage.getItem(`defaultAddress_${user.id}`);

      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
      if (savedDefaultAddress) setDefaultAddressId(JSON.parse(savedDefaultAddress));
    }
  }, [user]);

  // Guardar perfil
  const updateProfile = (profileData) => {
    const updatedProfile = { ...userProfile, ...profileData, updatedAt: new Date().toISOString() };
    setUserProfile(updatedProfile);
    
    if (user) {
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(updatedProfile));
    }
  };

  // Gestión de direcciones
  const addAddress = (addressData) => {
    const newAddress = {
      id: Date.now(),
      ...addressData,
      isDefault: addresses.length === 0, // Primera dirección es por defecto
      createdAt: new Date().toISOString()
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);

    if (addresses.length === 0) {
      setDefaultAddressId(newAddress.id);
    }

    if (user) {
      localStorage.setItem(`userAddresses_${user.id}`, JSON.stringify(updatedAddresses));
    }

    return newAddress;
  };

  const updateAddress = (addressId, addressData) => {
    const updatedAddresses = addresses.map(addr =>
      addr.id === addressId ? { ...addr, ...addressData, updatedAt: new Date().toISOString() } : addr
    );
    setAddresses(updatedAddresses);

    if (user) {
      localStorage.setItem(`userAddresses_${user.id}`, JSON.stringify(updatedAddresses));
    }
  };

  const deleteAddress = (addressId) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    setAddresses(updatedAddresses);

    if (defaultAddressId === addressId) {
      const newDefault = updatedAddresses[0]?.id || null;
      setDefaultAddressId(newDefault);
    }

    if (user) {
      localStorage.setItem(`userAddresses_${user.id}`, JSON.stringify(updatedAddresses));
    }
  };

  const setDefaultAddress = (addressId) => {
    setDefaultAddressId(addressId);
    
    if (user) {
      localStorage.setItem(`defaultAddress_${user.id}`, JSON.stringify(addressId));
    }
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.id === defaultAddressId) || addresses[0];
  };

  const value = {
    userProfile,
    addresses,
    defaultAddressId,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}