import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthRoutes from "./routes/AuthRoutes";
import AdminLogin from "./components/pages/AdminLogin";
import CompanyRegister from "@/components/pages/CompanyRegister";
import VerifyCompany from "@/components/ui/VerifyCompany";
import CompanyLogin from "@/components/pages/CompanyLogin";
import CompanyForgotPasswordForm from "@/components/forms/CompanyForgotPassword";
import CompanyResetPassword from "@/components/forms/CompanyResetPassword";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/admin-login" element={<AdminLogin />} />
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
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}

export default App;
