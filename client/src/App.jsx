import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/welcomePage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import GenderPage from "./components/GenderPage";
import AgePage from "./components/AgePage";
import UserDashboard from "./components/userDashboard";
import AdminDashboard from "./components/adminDashboard";
import ForgetPasswordPage from "./components/ForgetPasswordPage";
import VerifyOtpPage from "./components/VerifyOtpPage";
import AddBookForm from "./components/AddBooks/AddBookForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gender-page" element={<GenderPage />} />
        <Route path="/age-page" element={<AgePage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route path="/add-books" element={<AddBookForm />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
