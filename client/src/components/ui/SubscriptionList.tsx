import React, { useState } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { Plan } from "@/types/Plan";
import EditPlanModal from "./EditPlanModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDelete";

interface PlanListProps {
  plans: Plan[];
  onUpdatePlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
}

const PlanList: React.FC<PlanListProps> = ({
  plans,
  onUpdatePlan,
  onDeletePlan,
}) => {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (planId: string) => {
    setOpenMenuId(openMenuId === planId ? null : planId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan._id}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl relative"
        >
          {plan.isPopular && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center">
              <Zap size={14} className="mr-1" />
              Most Popular
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-center">
                  {plan.isActive ? (
                    <span className="flex items-center text-xs px-2 py-0.5 rounded-full text-green-600 bg-green-50">
                      <CheckCircle2 size={12} className="mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center text-xs px-2 py-0.5 rounded-full text-amber-600 bg-amber-50">
                      <Clock size={12} className="mr-1" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(plan._id)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-500" />
                </button>
                {openMenuId === plan._id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit size={16} className="mr-2 text-gray-500" />
                      Edit Plan
                    </button>
                    <button
                      onClick={() => {
                        setDeletingPlanId(plan._id);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Plan
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-600 mt-3 text-sm line-clamp-2">
              {plan.description}
            </p>

            <div className="mt-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.monthlyPrice}
                </span>
                <span className="text-gray-500 text-sm ml-2">per month</span>
              </div>

              {/* <div className="text-gray-600 text-sm mt-2">
                ${plan.annualPrice} per year
                {plan.monthlyPrice * 12 > plan.annualPrice && (
                  <span className="text-green-600 font-medium ml-1">
                    Save $
                    {(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(2)}
                  </span>
                )}
              </div> */}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Features:
              </h4>
              <ul className="space-y-2">
                {Object.entries(plan.features).map(([key, value], index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckCircle2
                      size={16}
                      className="mr-2 text-green-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-600">
                      {key[0].toUpperCase() + key.slice(1)}:{" "}
                      <strong>{value == -1 ? "Unlimited" : value}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => setEditingPlan(plan)}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium mr-2 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onUpdatePlan({ ...plan, isActive: !plan.isActive });
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                plan.isActive
                  ? "bg-white text-amber-600 border border-amber-200 hover:bg-amber-50"
                  : "bg-white text-green-600 border border-green-200 hover:bg-green-50"
              }`}
            >
              {plan.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      ))}

      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          isOpen={Boolean(editingPlan)}
          onClose={() => setEditingPlan(null)}
          onUpdate={(updatedPlan) => {
            onUpdatePlan(updatedPlan);
            setEditingPlan(null);
          }}
        />
      )}

      {deletingPlanId && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingPlanId)}
          onClose={() => setDeletingPlanId(null)}
          onConfirm={() => {
            if (deletingPlanId) {
              onDeletePlan(deletingPlanId);
              setDeletingPlanId(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default PlanList;
