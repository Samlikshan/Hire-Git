import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-modal"
        style={{ animationDuration: "0.3s" }}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Confirm Deletion
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete this subscription plan? This action
            cannot be undone.
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
