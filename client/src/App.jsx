import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy imports for route components
const WelcomePage = lazy(() => import("./components/welcomePage"));
const SignupPage = lazy(() => import("./components/SignupPage"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const GenderPage = lazy(() => import("./components/GenderPage"));
const AgePage = lazy(() => import("./components/AgePage"));
const UserDashboard = lazy(() => import("./components/userDashboard"));
const AdminDashboard = lazy(() => import("./components/adminDashboard"));
const ForgetPasswordPage = lazy(() => import("./components/ForgetPasswordPage"));
const VerifyOtpPage = lazy(() => import("./components/VerifyOtpPage"));
const AddBookForm = lazy(() => import("./components/AddBooks/AddBookForm"));
const ViewBooks = lazy(() => import("./components/ViewBooks/ViewBooks"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-10 text-lg">Loading...</div>}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gender-page" element={<GenderPage />} />
          <Route path="/age-page" element={<AgePage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/add-books" element={<AddBookForm />} />
          <Route path="/view-books" element={<ViewBooks />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
