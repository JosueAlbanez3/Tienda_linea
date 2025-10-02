// pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FaceRecognition from '../components/FaceRecognition';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { login, loginWithFaceRecognition, register } = useAuth(); // 🔥 Agregar loginWithFaceRecognition
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Para el admin, mostrar verificación facial
      if (email === 'admin@mitienda.com') {
        setShowFaceRecognition(true);
        return;
      }

      // Para usuarios normales, login directo
      const result = login(email, password);
      if (result.success) {
        navigate(result.user?.role === 'admin' ? '/admin' : '/');
      } else {
        setError(result.error);
      }
    } else {
      // Validaciones para registro
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      const result = register({ 
        email, 
        password,
        name: email.split('@')[0]
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    }
  };

  // Función para autocompletar credenciales del admin
  const fillAdminCredentials = () => {
    setEmail('admin@mitienda.com');
    setPassword('admin123');
    setIsLogin(true);
  };

  // Manejar detección facial exitosa - 🔥 MODIFICADA
  const handleFaceDetected = async (faceDescriptor) => {
    setIsVerifying(true);
    
    try {
      // Simular procesamiento de verificación facial
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 🔥 CAMBIAR: Usar la nueva función de login con reconocimiento facial
      const result = loginWithFaceRecognition(email, faceDescriptor);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError('Error en el login después de verificación facial');
        setShowFaceRecognition(false);
      }
    } catch (error) {
      setError('Error en la verificación facial');
      setShowFaceRecognition(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Manejar errores de reconocimiento facial
  const handleFaceError = (errorMessage) => {
    setError(errorMessage);
    setShowFaceRecognition(false);
  };

  if (showFaceRecognition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Verificación de Seguridad
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Verificación facial requerida para acceso administrativo
            </p>
          </div>

          {isVerifying ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Verificando Identidad
              </h3>
              <p className="text-gray-600">
                Analizando características faciales...
              </p>
            </div>
          ) : (
            <FaceRecognition
              onFaceDetected={handleFaceDetected}
              onError={handleFaceError}
            />
          )}

          <div className="text-center">
            <button
              onClick={() => setShowFaceRecognition(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Volver al login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setConfirmPassword('');
              }}
              className="font-medium text-primary hover:text-orange-600"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>

        {/* Credenciales del Admin - Solo mostrar en login */}
        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              👨‍💼 Acceso de Administrador
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Email:</strong> admin@mitienda.com</p>
              <p><strong>Contraseña:</strong> admin123</p>
              <p className="text-xs text-blue-600 mt-2">
                ⚠️ Requiere verificación facial de seguridad
              </p>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="mt-3 w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              Usar Credenciales de Admin
            </button>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Repite tu contraseña"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/" className="text-secondary hover:text-blue-600">
              ← Volver a la tienda
            </Link>
          </div>
        </form>

        {/* Información adicional */}
        <div className="text-center text-xs text-gray-500">
          {isLogin ? (
            <p>🔐 El acceso administrativo requiere verificación facial de seguridad</p>
          ) : (
            <p>👤 Los clientes se registran sin verificación facial</p>
          )}
        </div>
      </div>
    </div>
  );
}