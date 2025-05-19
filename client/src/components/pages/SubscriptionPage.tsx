import React, { useEffect, useState } from "react";
import PlanList from "@/components/ui/SubscriptionList";
import AddPlanModal from "@/components/ui/AddPlanModal";
import { Plus, Search } from "lucide-react";
import { Plan } from "@/types/Plan";
import {
  createPlanService,
  deletePlanService,
  listSubscriptionsService,
  updatePlanService,
} from "@/services/subscription";
import { toast } from "sonner";

const SubscriptionPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await listSubscriptionsService();
      if (response.status == 200) {
        setPlans(response.data.plans);
      }
    };
    fetchPlans();
  }, []);

  const handleAddPlan = async (newPlan: Partial<Plan>) => {
    const response = await createPlanService(newPlan);
    if (response.status == 200) {
      toast.success(response.data.message);
      setPlans([...plans, response.data.newPlan]);
    }

    setIsAddModalOpen(false);
  };

  const handleUpdatePlan = async (updatedPlan: Plan) => {
    const response = await updatePlanService(updatedPlan._id, updatedPlan);
    if (response.status == 200) {
      toast.success(response.data.message);
      setPlans(
        plans.map((plan) => (plan._id === updatedPlan._id ? updatedPlan : plan))
      );
    }
  };

  const handleDeletePlan = async (planId: string) => {
    const response = await deletePlanService(planId);
    if (response.status == 200) {
      toast.success(response.data.message);
      setPlans(plans.filter((plan) => plan._id !== planId));
    }
  };

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white shadow-sm animate-slide-in">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Subscription Plans
          </h1>
          <p className="text-gray-500 mt-1">
            Manage subscription plans and features
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 btn-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus size={18} className="mr-2" />
          <span>Add New Plan</span>
        </button>
      </div>

      <div className="p-6 bg-gray-50 flex-1 overflow-auto">
        <div className="mb-6 flex items-center gap-4 animate-slide-in">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <PlanList
          plans={filteredPlans}
          onUpdatePlan={handleUpdatePlan}
          onDeletePlan={handleDeletePlan}
        />
      </div>

      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPlan}
      />
    </div>
  );
};

export default SubscriptionPage;
