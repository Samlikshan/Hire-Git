import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface DeclineOfferModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DeclineOfferModal: React.FC<DeclineOfferModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 500;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  const handleSubmit = () => {
    if (!reason.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit(reason);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                Decline Job Offer
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Please provide a reason for declining this offer. This
                  feedback helps employers improve their hiring process.
                </p>
                <div className="mt-4">
                  <textarea
                    rows={4}
                    className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="Enter your reason for declining..."
                    value={reason}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setReason(e.target.value);
                      }
                    }}
                  ></textarea>
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-xs ${
                        reason.length > MAX_CHARS * 0.8
                          ? reason.length > MAX_CHARS
                            ? "text-red-600"
                            : "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {reason.length}/{MAX_CHARS} characters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={!reason.trim() || isSubmitting}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                !reason.trim() || isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              }`}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclineOfferModal;
