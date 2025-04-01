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
import Login from "./components/pages/Login";
import RequestResetLink from "./components/pages/RequestResetLink";
import ResetPassword from "./components/pages/ResetPassword";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminRoutes from "./routes/AdminRoutes";
import Admin from "./components/pages/Admin";
import CompanyTable from "./components/ui/compnay-table";
import CandidateTable from "./components/ui/candidate-table";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
            <Route
              path="/verify-email/:token"
              element={<EmailVerification />}
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/candidate/forgot-password"
              element={<RequestResetLink />}
            />
            <Route
              path="/candidate/reset-password/:token"
              element={<ResetPassword />}
            />
          </Route>

          <Route element={<AdminRoutes />}>
            <Route path="/admin" element={<Admin />}>
              <Route path="dashboard" element={<h1>Dashboard</h1>} />
              <Route path="companies" element={<CompanyTable />} />
              <Route path="candidates" element={<CandidateTable />} />
            </Route>
          </Route>
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
