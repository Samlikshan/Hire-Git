import React, { useState } from "react";
import { Star } from "lucide-react";
import { RatingCategory } from "@/types/Evaluation";

interface RatingInputProps {
  category: RatingCategory;
  label: string;
  value: number;
  onChange: (category: RatingCategory, value: number) => void;
  error?: string;
}

const ratingDescriptions = {
  1: "Poor",
  2: "Below Average",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

const RatingInput: React.FC<RatingInputProps> = ({
  category,
  label,
  value,
  onChange,
  error,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(category, star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(null)}
              className="p-1 focus:outline-none transition-transform duration-200 hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={28}
                className={`transition-all duration-200 ${
                  star <= (hoverValue || value)
                    ? "fill-amber-400 stroke-amber-400"
                    : "stroke-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-4 text-sm font-medium text-gray-600">
            {value > 0
              ? ratingDescriptions[value as keyof typeof ratingDescriptions]
              : ""}
          </span>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default RatingInput;
