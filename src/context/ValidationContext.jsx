// context/ValidationContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Tipos de validación disponibles
export const InputTypes = {
  TEXT: 'text',           // Solo letras y espacios
  NUMERIC: 'numeric',     // Solo números
  ALPHANUMERIC: 'alphanumeric', // Letras y números
  EMAIL: 'email',         // Validación de email
  PHONE: 'phone',         // Números y algunos caracteres especiales
  DECIMAL: 'decimal',     // Números con decimales
  CUSTOM: 'custom',       // Patrón personalizado
  NONE: 'none'            // Sin validación
};

const ValidationContext = createContext();

export function ValidationProvider({ children }) {
  const [isGlobalValidationActive, setIsGlobalValidationActive] = useState(true);

  // Patrones de validación
  const patterns = {
    [InputTypes.TEXT]: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/,
    [InputTypes.NUMERIC]: /^[0-9]*$/,
    [InputTypes.ALPHANUMERIC]: /^[a-zA-Z0-9\s]*$/,
    [InputTypes.EMAIL]: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    [InputTypes.PHONE]: /^[0-9+\-\s()]*$/,
    [InputTypes.DECIMAL]: /^[0-9]*\.?[0-9]*$/,
    [InputTypes.NONE]: /^.*$/ // Permite todo
  };

  // Mapeo automático de tipos de input HTML a nuestros tipos de validación
  const autoValidationMap = {
    'text': InputTypes.ALPHANUMERIC,
    'number': InputTypes.NUMERIC,
    'tel': InputTypes.PHONE,
    'email': InputTypes.NONE, // ← EMAILS SIN VALIDACIÓN
    'password': InputTypes.ALPHANUMERIC,
    'url': InputTypes.ALPHANUMERIC,
    'search': InputTypes.ALPHANUMERIC
  };

  // Detectar tipo de validación basado en el input
  const detectValidationType = (input) => {
    const htmlType = input.type || 'text';
    const name = input.name?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';
    const id = input.id?.toLowerCase() || '';

    // 🔥 PRIMERO: EXCLUIR EMAILS COMPLETAMENTE
    if (htmlType === 'email' || 
        name.includes('email') || 
        placeholder.includes('email') || 
        id.includes('email')) {
      return InputTypes.NONE; // ← SIN VALIDACIÓN
    }

    // 1. Verificar si tiene un atributo data-validation
    const dataValidation = input.getAttribute('data-validation');
    if (dataValidation && patterns[dataValidation]) {
      return dataValidation;
    }

    // 2. Verificar por tipo de input HTML
    if (autoValidationMap[htmlType]) {
      return autoValidationMap[htmlType];
    }

    // 3. Detectar por nombre, placeholder o id
    if (name.includes('name') || name.includes('nombre') || 
        placeholder.includes('nombre') || placeholder.includes('name') ||
        id.includes('name') || id.includes('nombre')) {
      return InputTypes.TEXT;
    }

    if (name.includes('phone') || name.includes('tel') || name.includes('telefono') ||
        placeholder.includes('tel') || placeholder.includes('phone') ||
        id.includes('phone') || id.includes('tel')) {
      return InputTypes.PHONE;
    }

    if (name.includes('age') || name.includes('edad') || name.includes('años') ||
        name.includes('number') || name.includes('numero') || name.includes('cantidad')) {
      return InputTypes.NUMERIC;
    }

    // 4. Por defecto, alphanumérico
    return InputTypes.ALPHANUMERIC;
  };

  // Validar input en tiempo real
  const validateInputValue = (value, validationType) => {
    const pattern = patterns[validationType];
    if (!pattern || validationType === InputTypes.NONE) return true; // ← Permitir todo si es NONE
    
    return pattern.test(value);
  };

  // Hook personalizado que puedes usar en cualquier componente (opcional)
  const useInputValidation = (initialValue = '', type = InputTypes.TEXT, customPattern = null) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');

    const validateInput = (inputValue) => {
      const pattern = customPattern || patterns[type];
      return pattern.test(inputValue);
    };

    const onChange = (e) => {
      const newValue = e.target.value;
      if (validateInput(newValue) || newValue === '') {
        setValue(newValue);
        setError('');
      }
    };

    const validate = () => {
      if (value.trim() === '' && type !== InputTypes.NUMERIC) {
        setError('Este campo es requerido');
        return false;
      }
      if (!validateInput(value)) {
        setError(`Formato inválido`);
        return false;
      }
      setError('');
      return true;
    };

    return {
      value,
      error,
      onChange,
      validate,
      clearError: () => setError(''),
      clear: () => setValue('')
    };
  };

  // 🔥 EFECTO PRINCIPAL: Validación global automática
  useEffect(() => {
    if (!isGlobalValidationActive) return;

    console.log('🔍 Validación global activada - Emails excluidos');

    const handleInput = (event) => {
      const input = event.target;
      if (input.tagName !== 'INPUT' && input.tagName !== 'TEXTAREA') return;

      // Si el input está marcado para excluir validación
      if (input.hasAttribute('data-no-validation')) return;

      const validationType = detectValidationType(input);
      const currentValue = input.value;

      // 🔥 SI ES EMAIL (NONE), NO HACER NADA
      if (validationType === InputTypes.NONE) {
        return;
      }

      // Validar el valor actual
      if (!validateInputValue(currentValue, validationType)) {
        // Revertir al último valor válido
        const lastValidValue = input.getAttribute('data-last-valid') || '';
        input.value = lastValidValue;
        
        // Prevenir la entrada inválida
        event.preventDefault();
        event.stopPropagation();
        
        // Agregar clase de error temporal
        input.classList.add('input-error-global');
        setTimeout(() => input.classList.remove('input-error-global'), 1000);
      } else {
        // Guardar último valor válido
        input.setAttribute('data-last-valid', currentValue);
        input.classList.remove('input-error-global');
      }
    };

    const handleBeforeInput = (event) => {
      const input = event.target;
      if (input.tagName !== 'INPUT' && input.tagName !== 'TEXTAREA') return;
      if (input.hasAttribute('data-no-validation')) return;

      const validationType = detectValidationType(input);
      
      // 🔥 SI ES EMAIL (NONE), NO HACER NADA
      if (validationType === InputTypes.NONE) {
        return;
      }

      const newValue = input.value + (event.data || '');

      // Prevenir entrada antes de que ocurra
      if (!validateInputValue(newValue, validationType)) {
        event.preventDefault();
        
        // Efecto visual de error
        input.classList.add('input-error-global');
        setTimeout(() => input.classList.remove('input-error-global'), 600);
      }
    };

    // Aplicar validación a inputs existentes
    const initializeExistingInputs = () => {
      document.querySelectorAll('input, textarea').forEach(input => {
        if (!input.hasAttribute('data-validation-initialized')) {
          const validationType = detectValidationType(input);
          input.setAttribute('data-validation-type', validationType);
          input.setAttribute('data-validation-initialized', 'true');
          input.setAttribute('data-last-valid', input.value);
          
          // Debug: mostrar qué tipo de validación se aplica
          if (validationType === InputTypes.NONE) {
            console.log('✅ Input de email excluido:', input.name || input.type);
          }
        }
      });
    };

    // Inicializar y agregar event listeners
    initializeExistingInputs();
    
    document.addEventListener('input', handleInput, true);
    document.addEventListener('beforeinput', handleBeforeInput, true);
    
    // Observar nuevos inputs que se agreguen al DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                initializeExistingInputs();
              } else if (node.querySelectorAll) {
                const inputs = node.querySelectorAll('input, textarea');
                if (inputs.length > 0) {
                  initializeExistingInputs();
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('beforeinput', handleBeforeInput, true);
      observer.disconnect();
    };
  }, [isGlobalValidationActive]);

  const value = {
    useInputValidation,
    validateValue: validateInputValue,
    getErrorMessage: (type) => {
      const messages = {
        [InputTypes.TEXT]: 'Solo se permiten letras y espacios',
        [InputTypes.NUMERIC]: 'Solo se permiten números',
        [InputTypes.ALPHANUMERIC]: 'Solo se permiten letras y números',
        [InputTypes.EMAIL]: 'Formato de email inválido',
        [InputTypes.PHONE]: 'Formato de teléfono inválido',
        [InputTypes.DECIMAL]: 'Solo se permiten números decimales'
      };
      return messages[type] || 'Formato inválido';
    },
    InputTypes,
    isGlobalValidationActive,
    setGlobalValidation: setIsGlobalValidationActive
  };

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}

// Hook para usar el contexto de validación
export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation debe usarse dentro de ValidationProvider');
  }
  return context;
};