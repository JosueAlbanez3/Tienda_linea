export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
}