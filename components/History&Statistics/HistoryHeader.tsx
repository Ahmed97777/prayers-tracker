import { Calendar } from "lucide-react";

const HistoryHeader = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
        <Calendar className="w-8 h-8 text-blue-600" />
        Prayer History
      </h1>
      <p className="text-gray-600 max-w-md mx-auto">
        Track your prayer journey and stay connected with your friends'
        spiritual progress
      </p>
    </div>
  );
};

export default HistoryHeader;
