import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Administrador por defecto
  const defaultAdmin = {
    id: 0, // ID especial para el admin
    email: 'admin@mitienda.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    avatar: '👨‍💼',
    createdAt: new Date().toISOString()
  };

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Inicializar usuarios con el admin por defecto si no existe
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar si el admin ya existe
    const adminExists = users.find(u => u.id === 0);
    
    if (!adminExists) {
      users.push(defaultAdmin);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  // Login function
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // No guardar la contraseña en el estado del usuario por seguridad
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }
  };

  // 🔥 NUEVA FUNCIÓN: Login con verificación facial
  const loginWithFaceRecognition = (email, faceDescriptor) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
      // En una app real, aquí verificarías el faceDescriptor contra una base de datos
      // Por ahora, simplemente hacemos login si el usuario existe
      
      // No guardar la contraseña en el estado del usuario por seguridad
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Guardar el descriptor facial para futuras verificaciones (en una app real)
      console.log('Descriptor facial recibido:', faceDescriptor);
      
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: 'Usuario no encontrado' };
    }
  };

  // Register function - Solo para clientes
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'El email ya está registrado' };
    }

    // No permitir registrar con el email del admin
    if (userData.email === defaultAdmin.email) {
      return { success: false, error: 'Este email no está disponible' };
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'customer', // Todos los nuevos usuarios son clientes
      avatar: '👤',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login después del registro (sin password en el estado)
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  };

  // Función para actualizar contraseña
  const updatePassword = (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error('No hay usuario autenticado'));
          return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) {
          reject(new Error('Usuario no encontrado'));
          return;
        }

        // Verificar contraseña actual
        if (users[userIndex].password !== currentPassword) {
          reject(new Error('La contraseña actual es incorrecta'));
          return;
        }

        // Validar nueva contraseña
        if (newPassword.length < 6) {
          reject(new Error('La nueva contraseña debe tener al menos 6 caracteres'));
          return;
        }

        if (currentPassword === newPassword) {
          reject(new Error('La nueva contraseña debe ser diferente a la actual'));
          return;
        }

        // Actualizar contraseña
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        resolve({ success: true, message: 'Contraseña actualizada correctamente' });
      }, 500);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    loginWithFaceRecognition, // 🔥 Agregar esta línea
    register,
    updatePassword,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}