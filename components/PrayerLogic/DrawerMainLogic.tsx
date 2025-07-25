import { Prayer } from "@/utils/types";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { prayerStatusOptions } from "@/utils/constants";

interface DrawerMainLogicProps {
  selectedPrayer: Prayer | null;
  loading: boolean;
  handleStatusSelect: (status: "ON_TIME" | "LATE" | "JAMAAH") => void;
}

export default function DrawerMainLogic({
  selectedPrayer,
  loading,
  handleStatusSelect,
}: DrawerMainLogicProps) {
  return (
    <DrawerContent className="max-w-md mx-auto">
      <DrawerHeader className="pb-4">
        {selectedPrayer && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <selectedPrayer.icon size={32} className="text-blue-600" />
            </div>
            <DrawerTitle className="text-xl font-bold text-gray-900">
              {selectedPrayer.name} Prayer
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 mt-2">
              How did you complete your {selectedPrayer.name} prayer today?
            </DrawerDescription>
          </div>
        )}
      </DrawerHeader>

      <div className="px-4 pb-6">
        <div className="space-y-2">
          {prayerStatusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleStatusSelect(option.id)}
              disabled={loading}
              className={`w-full flex items-center p-4 rounded-xl border border-gray-200 text-left transition-all duration-200 ${option.color} disabled:opacity-50`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <option.icon className="text-gray-600" size={20} />
              </div>
              <span className="font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </DrawerContent>
  );
}
