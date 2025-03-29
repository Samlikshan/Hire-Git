import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthRoutes from "./routes/AuthRoutes";
import AdminLogin from "./pages/AdminLogin";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/admin-login" element={<AdminLogin />} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}

export default App;
