export default function LoadingSpinner({ size = 'md', text = 'Cargando...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-primary ${sizes[size]}`}></div>
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
}