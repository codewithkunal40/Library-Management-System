import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPopup from "./components/AuthPopup";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import Login from "./components/Login"
import { ToastContainer } from "react-toastify";

function Home() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 mb-4"
      >
        Sign Up
      </button>

      <a
        href="/login"
        className="text-blue-600 underline hover:text-blue-800"
      >
        Already have an account? Login
      </a>

      {showPopup && <AuthPopup setShowPopup={setShowPopup} />}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
