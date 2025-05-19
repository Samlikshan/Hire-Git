import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  UserCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import RatingInput from "./RatingInput";
import { Button } from "@/components/ui/button";
import ProgressSteps from "@/components/ui/ProgressStep";
import {
  EvaluationFormData,
  FormErrors,
  RatingCategory,
} from "@/types/Evaluation";
import { evaluateCandidateService } from "@/services/interview";

const ratingLabels = {
  communication: "Communication Skills",
  technical: "Technical Competence",
  cultureFit: "Culture Fit",
};

const recommendationOptions = [
  {
    value: "hire",
    label: "Hire",
    description: "Candidate meets or exceeds our requirements",
    color: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-500",
    iconColor: "text-green-500",
  },
  {
    value: "hold",
    label: "Hold",
    description: "Potential fit, but need to evaluate further",
    color: "bg-yellow-50 hover:bg-yellow-100",
    borderColor: "border-yellow-500",
    iconColor: "text-yellow-500",
  },
  {
    value: "reject",
    label: "Reject",
    description: "Not a good fit for the position",
    color: "bg-red-50 hover:bg-red-100",
    borderColor: "border-red-500",
    iconColor: "text-red-500",
  },
];

const steps = ["Ratings", "Notes & Recommendation"];

const EvaluationForm = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomID } = location.state || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"right" | "left">(
    "right"
  );
  const [formData, setFormData] = useState<EvaluationFormData>({
    roomID,
    completedAt: new Date(),
    ratings: {
      communication: 0,
      technical: 0,
      cultureFit: 0,
    },
    notes: "",
    recommendation: "" as "hire" | "hold" | "reject",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!roomID) {
      navigate(-1); // Redirect back if no roomID
      return;
    }

    setFormData((prev) => ({
      ...prev,
      roomID,
    }));
  }, [roomID, navigate]);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 0) {
      if (!formData.ratings.communication) {
        newErrors.ratings = {
          ...newErrors.ratings,
          communication: "Communication rating is required",
        };
      }
      if (!formData.ratings.technical) {
        newErrors.ratings = {
          ...newErrors.ratings,
          technical: "Technical rating is required",
        };
      }
      if (!formData.ratings.cultureFit) {
        newErrors.ratings = {
          ...newErrors.ratings,
          cultureFit: "Culture fit rating is required",
        };
      }
    } else if (step === 1) {
      if (!formData.notes.trim()) {
        newErrors.notes = "Please provide some notes about the meeting";
      }
      if (!formData.recommendation) {
        newErrors.recommendation = "Please select a recommendation";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setFormData({
      ...formData,
      ratings: {
        ...formData.ratings,
        [category]: value,
      },
    });

    if (errors.ratings?.[category]) {
      setErrors({
        ...errors,
        ratings: {
          ...errors.ratings,
          [category]: undefined,
        },
      });
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = e.target.value.slice(0, 500);
    setFormData({
      ...formData,
      notes,
    });

    if (errors.notes) {
      setErrors({
        ...errors,
        notes: undefined,
      });
    }
  };

  const handleRecommendationChange = (value: "hire" | "hold" | "reject") => {
    setFormData({
      ...formData,
      recommendation: value,
    });

    if (errors.recommendation) {
      setErrors({
        ...errors,
        recommendation: undefined,
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSlideDirection("right");
      setCurrentStep((current) => current + 1);
    }
  };

  const handleBack = () => {
    setSlideDirection("left");
    setCurrentStep((current) => current - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    console.log(formData, "formData");

    try {
      const response = await evaluateCandidateService(formData);

      if (response.status != 200) throw new Error("Submission failed");

      setIsSubmitted(true);
      setTimeout(() => navigate("/company/jobs"), 2000);
    } catch (error) {
      console.error("Evaluation submission error:", error);
      setErrors({ submit: "Failed to submit evaluation. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center  bg-black/50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden p-8 animate-scale-in">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle
                className="h-12 w-12 text-green-600"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Evaluation Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your feedback. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                Meeting Evaluation
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                {roomID && `Room ID: ${roomID}`}
              </p>
            </div>
            <div className="flex items-center space-x-4 text-white/80">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <UserCircle className="w-4 h-4 mr-1" />
                <span>{userData?.name || "Evaluator"}</span>
              </div>
            </div>
          </div>
        </div>

        <ProgressSteps steps={steps} currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="p-6">
          <div className="min-h-[350px] overflow-hidden">
            {currentStep === 0 && (
              <div className={`space-y-4 animate-slide-in-${slideDirection}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Performance Ratings
                  </h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>All ratings required</span>
                  </div>
                </div>
                {Object.entries(ratingLabels).map(([category, label]) => (
                  <RatingInput
                    key={category}
                    category={category as RatingCategory}
                    label={label}
                    value={formData.ratings[category as RatingCategory]}
                    onChange={handleRatingChange}
                    error={errors.ratings?.[category as RatingCategory]}
                  />
                ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className={`space-y-4 animate-slide-in-${slideDirection}`}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Meeting Notes
                    </h2>
                    <div className="text-sm text-gray-500">
                      {formData.notes.length}/500 characters
                    </div>
                  </div>
                  <div className="mb-4">
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={handleNotesChange}
                      rows={4}
                      maxLength={500}
                      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.notes ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Provide detailed notes about the meeting outcomes and discussions..."
                    />
                    {errors.notes && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Final Recommendation
                  </h2>
                  <div className="space-y-2">
                    {recommendationOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() =>
                          handleRecommendationChange(
                            option.value as "hire" | "hold" | "reject"
                          )
                        }
                        className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                          formData.recommendation === option.value
                            ? `${option.color} ${option.borderColor}`
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 mr-3 ${
                              formData.recommendation === option.value
                                ? `${option.borderColor} ${option.iconColor}`
                                : "border-gray-300"
                            }`}
                          >
                            {formData.recommendation === option.value && (
                              <span className="flex items-center justify-center text-current text-xs">
                                ✓
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-gray-800 font-medium text-sm">
                              {option.label}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {errors.recommendation && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <div>
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="flex items-center text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  // isLoading={isSubmitting}
                >
                  Submit Evaluation
                </Button>
              )}
            </div>
          </div>
          {errors.submit && (
            <p className="text-sm text-red-500 mt-2 text-center">
              {errors.submit}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EvaluationForm;
