import React from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // to Home Page
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-100 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-6">User Dashboard</h1>
      <p className="text-lg mb-8">
        Welcome, User! Explore and enjoy our services.
      </p>

      <button
        onClick={handleLogout}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
