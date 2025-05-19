import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Download } from "lucide-react";
import { Subscription } from "@/types/Subscription";
import { formatDate } from "@/lib/utils";

const SubscriptionHistory: React.FC<{ subscriptions: Subscription[] }> = ({
  subscriptions,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover-lift">
      <div className="p-8">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText size={20} className="mr-2 text-gray-700" />
            Payment History
          </h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {expanded && (
          <div className="mt-6 space-y-4 animate-slideDown max-h-96 overflow-y-scroll scrollbar-hide">
            {subscriptions.map((subscription) => (
              <div
                key={subscription._id}
                className={`p-4 rounded-xl border ${
                  selectedInvoice === subscription._id
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-100 hover:bg-gray-50"
                } transition-all cursor-pointer`}
                onClick={() =>
                  setSelectedInvoice(
                    selectedInvoice === subscription._id
                      ? null
                      : subscription._id
                  )
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 bg-white rounded-full p-2 shadow-sm">
                      <FileText size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(subscription.startedAt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {subscription.plan.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${subscription.plan.monthlyPrice.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${getStatusStyle(
                        subscription.status
                      )}`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                </div>

                {selectedInvoice === subscription._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                    <div className="grid grid-cols gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500">Invoice ID</p>
                        <p className="font-medium text-gray-900">
                          {/* INV-{item.id.toString().padStart(6, "0")} */}
                          {subscription.invoiceId}
                        </p>
                      </div>
                      {/* <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-900">•••• 4242</p>
                      </div> */}
                    </div>
                    <a
                      href={subscription.invoice}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Download size={16} className="mr-2" />
                        Download Invoice
                      </button>
                    </a>
                  </div>
                )}
              </div>
            ))}

            {subscriptions.length > 4 && (
              <button className="w-full py-3 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                View Complete History
              </button>
            )}
          </div>
        )}

        {!expanded && subscriptions.length > 0 && (
          <div className="mt-3 text-sm text-gray-500">
            {subscriptions.length} transactions in your history
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionHistory;
