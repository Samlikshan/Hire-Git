import { useState } from "react";
import { FloatingInput } from "../ui/Input1";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { loginService, loginWithGoogle } from "../../services/auth";
import { useDispatch } from "react-redux";
import { login } from "../../reducers/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email address.";

    if (!form.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await loginService(form.email, form.password);
        const { user } = response.data;
        if (response.status === 200) {
          toast.success(response?.data?.message);
          setTimeout(() => {
            dispatch(login({ ...user, role: "candidate" }));
            navigate("/");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await loginWithGoogle(credential);
      const { user } = response.data;
      if (response.status === 200) {
        toast.success(response?.data?.message);
        setTimeout(() => {
          dispatch(login({ ...user, role: "candidate" }));
          navigate("/");
        }, 1000);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Oops, something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <div className="relative">
              <FloatingInput
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
                error={errors.email}
              />
              <Mail
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {/* {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )} */}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <FloatingInput
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) => setForm({ ...form, password: value })}
                error={errors.password}
              />
              <Lock
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {/* {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )} */}
          </div>

          <div className="flex justify-end">
            <span
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/candidate/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            Sign in
          </button>

          <div className="relative flex items-center justify-center mt-8">
            <div className="border-t border-gray-200 w-full absolute"></div>
            <div className="bg-white px-4 relative text-sm text-gray-500">
              or continue with
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={async (response) => {
                if (response.credential) {
                  handleGoogleLogin(response.credential);
                }
              }}
              onError={() => toast("Google auth failed")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
