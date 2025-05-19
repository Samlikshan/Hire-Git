import React, { useState } from "react";
import {
  CreditCard,
  ArrowUpCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface PlanActionsProps {
  isActive: boolean;
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
  };
}

const PlanActions: React.FC<PlanActionsProps> = ({
  isActive,
  paymentMethod,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover-lift">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <CreditCard size={20} className="mr-2 text-gray-700" />
          Plan Management
        </h2>

        <div className="flex items-center p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-6">
          <div className="mr-4 bg-white rounded-full p-2.5 shadow-sm">
            <CreditCard size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {paymentMethod.type} •••• {paymentMethod.last4}
              <span className="ml-2 text-sm text-gray-500">
                exp {paymentMethod.expiry}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl flex items-center justify-center transition-all hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 hover:shadow-lg ripple animate-scale">
            <ArrowUpCircle size={18} className="mr-2" />
            Upgrade Plan
          </button>

          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full py-3.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl flex items-center justify-center transition-all hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 hover:border-gray-300 ripple"
            >
              <XCircle size={18} className="mr-2 text-gray-500" />
              Cancel Subscription
            </button>
          ) : (
            <div className="p-5 bg-red-50 border border-red-100 rounded-xl animate-fadeIn">
              <div className="flex items-start mb-4">
                <AlertTriangle
                  size={20}
                  className="text-red-600 mr-2 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-red-800 font-medium mb-1">
                    Cancel Subscription?
                  </p>
                  <p className="text-sm text-red-700">
                    This will end your access to premium features at the end of
                    your billing period.
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 py-2.5 px-4 bg-red-600 text-white text-sm font-medium rounded-lg transition-all hover:bg-red-700 focus:ring-2 focus:ring-red-300 ripple">
                  Confirm Cancellation
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-all hover:bg-gray-50 focus:ring-2 focus:ring-gray-200"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          )}

          {isActive && (
            <button className="w-full text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors py-2 flex items-center justify-center">
              <CreditCard size={16} className="mr-1.5" />
              Update payment method
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanActions;
