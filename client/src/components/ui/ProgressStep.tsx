import React from "react";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="px-6 py-3 border-b border-gray-200">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 font-medium text-xs
                  ${
                    index <= currentStep
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
