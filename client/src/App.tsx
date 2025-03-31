import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthRoutes from "./routes/AuthRoutes";
import AdminLogin from "./components/pages/AdminLogin";
import CompanyRegister from "@/components/pages/CompanyRegister";
import VerifyCompany from "@/components/ui/VerifyCompany";
import CompanyLogin from "@/components/pages/CompanyLogin";
import CompanyForgotPasswordForm from "@/components/forms/CompanyForgotPassword";
import CompanyResetPassword from "@/components/forms/CompanyResetPassword";
import Signup from "./components/pages/Signup";
import EmailVerification from "./components/pages/EmailVerification";

import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route element={<AuthRoutes />}>
          {/* Admin */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Company */}
          <Route path="/company-register" element={<CompanyRegister />} />
          <Route path="/verify-company/:token" element={<VerifyCompany />} />
          <Route path="company-login" element={<CompanyLogin />} />
          <Route
            path="company-forgot-password"
            element={<CompanyForgotPasswordForm />}
          />
          <Route
            path="/company/reset-password/:token"
            element={<CompanyResetPassword />}
          />

          {/* Candidate */}
          <Route path="/register" element={<Signup />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}

export default App;
