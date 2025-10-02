// components/ProductForm.jsx
import { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'electronics',
    description: '',
    stock: '',
    image: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || 'electronics',
        description: product.description || '',
        stock: product.stock || '',
        image: product.image || ''
      });
    }
  }, [product]);

  const categories = [
    'electronics',
    'clothing', 
    'home',
    'sports',
    'books',
    'toys',
    'beauty',
    'food'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.image.trim()) newErrors.image = 'La URL de la imagen es requerida';

    // Validar que la URL sea válida
    try {
      new URL(formData.image);
    } catch (e) {
      newErrors.image = 'La URL no es válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
    }
  };

  // FUNCIÓN CORREGIDA - Permitir cualquier caracter
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Permitir cualquier caracter en todos los campos
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Función para manejar pegado de texto
  const handlePaste = (e) => {
    // Permitir pegado en todos los campos
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    const { name } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: pastedText
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre del Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onPaste={handlePaste}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: iPhone 14 Pro"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            onPaste={handlePaste}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            onPaste={handlePaste}
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        {/* URL de la Imagen */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de la Imagen *
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            onPaste={handlePaste}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          
          {/* Vista previa de la imagen */}
          {formData.image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img 
                src={formData.image} 
                alt="Vista previa" 
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onPaste={handlePaste}
            rows="4"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe el producto..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {product ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;