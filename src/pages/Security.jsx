import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Security() {
  const { user, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    // Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Todos los campos son requeridos');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Las nuevas contraseñas no coinciden');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      // Llamar a la función de actualización de contraseña
      const result = await updatePassword(currentPassword, newPassword);
      
      if (result.success) {
        setMessage('✅ ' + result.message + ' La próxima vez que inicies sesión usa tu nueva contraseña.');
        setMessageType('success');
        
        // Limpiar formulario
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
      
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para verificar fortaleza de contraseña
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: 'Muy débil' };
    
    let strength = 1;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const texts = ['', 'Débil', 'Regular', 'Buena', 'Fuerte', 'Muy fuerte'];
    return { strength, text: texts[strength] };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Contraseña y Seguridad</h1>
        <p className="text-gray-600 mb-8">Gestiona la seguridad de tu cuenta y contraseñas</p>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Cambiar Contraseña</h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            {/* Contraseña Actual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ingresa tu contraseña actual"
                required
                disabled={isLoading}
              />
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ingresa tu nueva contraseña"
                required
                minLength={6}
                disabled={isLoading}
              />
              
              {/* Indicador de fortaleza de contraseña */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 1 ? 'bg-red-500 w-1/5' :
                          passwordStrength.strength === 2 ? 'bg-orange-500 w-2/5' :
                          passwordStrength.strength === 3 ? 'bg-yellow-500 w-3/5' :
                          passwordStrength.strength === 4 ? 'bg-green-500 w-4/5' :
                          passwordStrength.strength === 5 ? 'bg-green-600 w-full' : 'bg-gray-200 w-0'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 2 ? 'text-red-600' :
                      passwordStrength.strength === 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    La contraseña debe tener al menos 6 caracteres
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  confirmPassword && newPassword !== confirmPassword 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Confirma tu nueva contraseña"
                required
                disabled={isLoading}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            {/* Mensaje de resultado */}
            {message && (
              <div className={`p-4 rounded-lg border ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <div className="flex items-center">
                  {messageType === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{message}</span>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </div>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>
        </div>

        {/* Información de seguridad */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">🔒 Recomendaciones de Seguridad</h3>
          <ul className="text-blue-700 text-sm space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Usa una combinación de letras, números y símbolos
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              No uses la misma contraseña en múltiples sitios
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Cambia tu contraseña regularmente
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Nunca compartas tu contraseña con nadie
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}