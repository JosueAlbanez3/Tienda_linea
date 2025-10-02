import { useState } from 'react';

export default function ShareProduct({ product }) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = `¡Mira este producto: ${product.name} por $${product.price} en MiTienda!`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💚',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Email',
      icon: '📧',
      url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace copiado al portapapeles!');
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsShareOpen(!isShareOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
      >
        <span>📤</span>
        <span>Compartir</span>
      </button>

      {isShareOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-4 z-50 min-w-48">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-2 hover:bg-gray-50 rounded transition-colors"
                onClick={() => setIsShareOpen(false)}
              >
                <span className="text-2xl mb-1">{option.icon}</span>
                <span className="text-xs">{option.name}</span>
              </a>
            ))}
          </div>
          
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-3 py-2 rounded hover:bg-orange-600 transition-colors text-sm"
          >
            <span>📋</span>
            <span>Copiar enlace</span>
          </button>
        </div>
      )}
    </div>
  );
}