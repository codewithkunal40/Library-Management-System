import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBooks from "./AddBooks/AddBookForm";
import ViewBooks from "./ViewBooks/ViewBooks";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("user"));
    if (!storedAdmin || storedAdmin.role !== "admin") navigate("/");
    else setAdmin(storedAdmin);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const displayName =
    admin?.displayName || admin?.name || admin?.username || "Admin";
  const profileImage =
    admin?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const renderMainContent = () => {
    switch (selectedSection) {
      case "view-books":
        return <ViewBooks />;
      case "add-books":
        return <AddBooks />;
      case "dashboard":
      default:
        return (
          <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg font-medium text-gray-600 text-center">
              Welcome back, {displayName}! Use the sidebar to manage books.
            </p>
          </div>
        );
    }
  };

  return admin ? (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-orange-100 to-orange-300">
      <aside className="w-full md:w-72 bg-white text-gray-800 shadow-xl p-6 md:rounded-tr-3xl md:rounded-br-3xl flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-8">
            <img
              src={profileImage}
              alt="Admin Profile"
              className="w-24 h-24 rounded-full border-4 border-orange-300 object-cover"
            />
            <h2 className="mt-3 text-xl font-bold">{displayName}</h2>
            <p className="text-sm text-gray-500 mt-1 font-semibold">
              Email: {admin.email}
            </p>
            <p className="text-sm text-gray-500 font-semibold">Role: Admin</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setSelectedSection("dashboard")}
              className={`w-full py-2 px-4 rounded-lg text-left font-semibold transition duration-200 ${
                selectedSection === "dashboard"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-gray-800 hover:bg-orange-200"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setSelectedSection("add-books")}
              className={`w-full py-2 px-4 rounded-lg text-left font-semibold transition duration-200 ${
                selectedSection === "add-books"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-gray-800 hover:bg-orange-200"
              }`}
            >
              Add Books
            </button>
            <button
              onClick={() => setSelectedSection("view-books")}
              className={`w-full py-2 px-4 rounded-lg text-left font-semibold transition duration-200 ${
                selectedSection === "view-books"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-gray-800 hover:bg-orange-200"
              }`}
            >
              View Books
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition duration-200"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{renderMainContent()}</main>
    </div>
  ) : null;
};

export default AdminDashboard;
