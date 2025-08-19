import { FC } from "react";

const LoadingSpinner: FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <div className="absolute inset-0 rounded-full h-12 w-12 border-2 border-gray-200"></div>
    </div>
  </div>
);


export default LoadingSpinner