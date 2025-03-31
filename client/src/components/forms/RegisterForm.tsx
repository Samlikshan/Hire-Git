import { useState } from "react";
import { FloatingInput } from "../ui/Input1";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { registerService } from "../../services/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { name: "", email: "", password: "" };

    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email address.";

    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await registerService(
          form.name,
          form.email,
          form.password
        );

        if (response.status == 200) {
          toast.success(response?.data?.message);
          setTimeout(() => {
            setStep(step + 1);
          }, 1000);
        } else {
          toast(response.data.error);
        }
      } catch (err: unknown) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {step === 1 && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl transform transition-all">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl rotate-45 transform mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white -rotate-45 translate-x-4 translate-y-4" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Get Hired
              </h1>
              <p className="text-gray-500">
                Already have an account?{" "}
                <span
                  className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <FloatingInput
                label="Name"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
                error={errors.name}
              />
              <FloatingInput
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
                error={errors.email}
              />
              <FloatingInput
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) => setForm({ ...form, password: value })}
                error={errors.password}
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl
                  hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
                  shadow-lg hover:shadow-xl"
              >
                Create account
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              By signing up, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      )}
      {step == 2 && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center relative">
            <button
              onClick={() => setStep(step - 1)}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 group transition-colors"
            >
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-12 h-12 text-blue-500" />
                </div>
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verify your email address
            </h2>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-blue-800">
                We've sent a verification link to:
                <br />
                <span className="font-medium">{form.email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-gray-600">
                <p className="mb-2">
                  Please click on the link in the email to confirm your email
                  address.
                </p>
                <p className="text-sm">
                  If you don't see the email, check your spam folder.
                </p>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl
                  hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
                  shadow-lg hover:shadow-xl"
              >
                Resend Email
              </button>

              <p className="text-sm text-gray-500">
                Need help?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
