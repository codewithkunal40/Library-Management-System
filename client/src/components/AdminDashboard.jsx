import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); //  to home page
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-red-100 p-6">
      <h1 className="text-4xl font-bold text-red-700 mb-6">Admin Dashboard</h1>
      <p className="text-lg mb-8">
        Welcome, Admin! Manage the platform efficiently.
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
