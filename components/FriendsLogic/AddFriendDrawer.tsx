import { useEffect, useState } from "react";

import { UserPlus, Mail, ArrowLeft, Check, AlertCircle } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

const AddFriendDrawer = ({
  isOpen,
  onClose,
  onAddFriend,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (email: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError("");
    setSuccess(false);

    const result = await onAddFriend(email);

    if (result.success) {
      setSuccess(true);
      setEmail("");
      // Close drawer after successful addition with a small delay to show success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 500);
    } else {
      setError(result.error || "Failed to add friend");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure drawer is fully rendered
      setTimeout(() => {
        const emailInput = document.querySelector(
          'input[type="email"]'
        ) as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <DrawerTitle className="text-xl font-bold text-gray-900">
                Add Friend
              </DrawerTitle>
              <DrawerDescription className="text-gray-600">
                Enter your friend's email to share your prayer journey
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg flex items-center space-x-2">
              <Check size={18} />
              <span>Friend added successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center space-x-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative mb-4">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                placeholder="Enter friend's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading || success}
              />
            </div>

            {/* Add Button */}
            <button
              type="submit"
              disabled={!email.trim() || isLoading || success}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>Adding Friend...</span>
                </>
              ) : success ? (
                <>
                  <Check size={18} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Add Friend</span>
                </>
              )}
            </button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddFriendDrawer;
