import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const FloatingInput = ({
  label,
  type = "text",
  value,
  error,
  onChange,
}: FloatingInputProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && !showPassword ? "password" : "text";

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(value !== "")}
        className={`peer w-full p-3 pt-5 text-base rounded-lg border bg-transparent focus:ring-2 outline-none transition-all 
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
      />
      <label
        className={`absolute left-3 transition-all text-gray-400 text-base px-1 bg-white
          ${
            focused || value
              ? "-top-2 text-xs text-gray-600"
              : "top-4 text-base"
          }`}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          className="absolute right-3 top-4 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
