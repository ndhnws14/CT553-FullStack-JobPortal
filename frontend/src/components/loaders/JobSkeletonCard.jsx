const JobSkeletonCard = () => (
  <div className="p-4 rounded-2xl bg-gray-100 animate-pulse h-[250px]">
    <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 rounded w-full"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);

export default JobSkeletonCard;
