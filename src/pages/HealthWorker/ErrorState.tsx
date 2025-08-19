import { XCircle, RefreshCw } from "lucide-react";
import { FC } from "react";

const ErrorState: FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <XCircle className="h-12 w-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Data</h3>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <RefreshCw className="h-4 w-4" />
      <span>Retry</span>
    </button>
  </div>
);
export default ErrorState