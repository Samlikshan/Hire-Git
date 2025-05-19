import React, { useState } from "react";
import { X, PlusCircle, MinusCircle } from "lucide-react";
import { Plan } from "@/types/Plan";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: Partial<Plan>) => void;
}

const AddPlanModal: React.FC<AddPlanModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    name: "",
    description: "",
    monthlyPrice: 0,
    // annualPrice: 0,
    features: {},
    isPopular: false,
    isActive: true,
  });

  const [tempFeature, setTempFeature] = useState({ key: "", value: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setNewPlan({ ...newPlan, [name]: target.checked });
    } else if (type === "number") {
      setNewPlan({ ...newPlan, [name]: parseFloat(value) });
    } else {
      setNewPlan({ ...newPlan, [name]: value });
    }
  };

  const addFeature = () => {
    if (
      tempFeature.key.trim().toLocaleLowerCase() &&
      Number(tempFeature.value)
    ) {
      setNewPlan({
        ...newPlan,
        features: {
          ...newPlan.features,
          [tempFeature.key]: tempFeature.value,
        },
      });
      setTempFeature({ key: "", value: "" });
    }
  };

  const removeFeature = (key: string) => {
    const updatedFeatures = { ...newPlan.features };
    delete updatedFeatures[key];
    setNewPlan({
      ...newPlan,
      features: updatedFeatures,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      ...newPlan,
    });

    setNewPlan({
      name: "",
      description: "",
      monthlyPrice: 0,
      // annualPrice: 0,
      features: {},
      isPopular: false,
      isActive: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Subscription Plan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-8rem)]"
        >
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800">
                Plan Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Plan Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={newPlan.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Basic, Professional, Enterprise"
                  />
                </div>

                <div className="flex items-center space-x-8 mt-6 md:mt-0">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={newPlan.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Active
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPopular"
                      name="isPopular"
                      checked={newPlan.isPopular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isPopular"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Mark as Popular
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={newPlan.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of the plan"
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <h3 className="text-md font-medium text-gray-800">Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="monthlyPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Monthly Price ($)*
                  </label>
                  <input
                    type="number"
                    id="monthlyPrice"
                    name="monthlyPrice"
                    required
                    min="0"
                    step="0.01"
                    value={newPlan.monthlyPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>

                {/* <div>
                  <label
                    htmlFor="annualPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Annual Price ($)*
                  </label>
                  <input
                    type="number"
                    id="annualPrice"
                    name="annualPrice"
                    required
                    min="0"
                    step="0.01"
                    value={newPlan.annualPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                  {newPlan.monthlyPrice > 0 && newPlan.annualPrice > 0 && (
                    <div className="mt-1 text-sm text-green-600">
                      Annual savings: $
                      {(
                        newPlan.monthlyPrice * 12 -
                        newPlan.annualPrice
                      ).toFixed(2)}
                    </div>
                  )}
                </div> */}
                <div>
                  <label
                    htmlFor="stripePriceId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stripe Price*
                  </label>
                  <input
                    type="string"
                    id="stripePriceId"
                    name="stripePriceId"
                    required
                    value={newPlan.stripePriceId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="eg. price_1RJV7O2RaT7tkoDZ4Ukk0iHO"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-800">Features</h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={tempFeature.key}
                      onChange={(e) =>
                        setTempFeature({ ...tempFeature, key: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Feature name (e.g. Storage)"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={tempFeature.value}
                      onChange={(e) =>
                        setTempFeature({
                          ...tempFeature,
                          value: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Value (e.g. 5GB)"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-indigo-600 hover:text-indigo-700 transition-colors p-2"
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                </div>

                {Object.entries(newPlan.features!).map(
                  ([key, value], index) => (
                    <div key={index} className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={key}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={value}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => removeFeature(key)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        >
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlanModal;
