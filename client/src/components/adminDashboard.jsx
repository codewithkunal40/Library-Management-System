import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBooks from "./AddBooks/AddBookForm";
import ViewBooks from "./ViewBooks/ViewBooks";
import AdminFines from "./AdminFines";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("user"));
    if (!storedAdmin || storedAdmin.role !== "admin") navigate("/");
    else setAdmin(storedAdmin);
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      }
    };

    if (admin) fetchStats();
  }, [admin]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (selectedSection === "manage-users") {
      fetchUsers();
    }
  }, [selectedSection]);

  const handlePromote = async (id) => {
    try {
      const res = await fetch(`/api/admin/promote/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      alert(data.msg);
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user", error);
    }
  };

  const handleDemote = async (id) => {
    try {
      const res = await fetch(`/api/admin/demote/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      alert(data.msg);
      fetchUsers();
    } catch (error) {
      console.error("Error demoting admin", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const displayName =
    admin?.displayName || admin?.name || admin?.username || "Admin";
  const profileImage =
    admin?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const barStatsData = stats
    ? [
        { name: "Users", value: stats.totalUsers },
        { name: "Books", value: stats.totalBooks },
        { name: "Borrowed", value: stats.borrowedBooks },
        { name: "Returned", value: stats.returnedBooks },
      ]
    : [];

  const borrowReturnData = stats
    ? [
        { name: "Borrowed", value: stats.borrowedBooks },
        { name: "Returned", value: stats.returnedBooks },
      ]
    : [];

  const renderMainContent = () => {
    switch (selectedSection) {
      case "view-books":
        return <ViewBooks />;
      case "add-books":
        return <AddBooks />;
      case "manage-users":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-orange-800 text-center">
              Manage Users
            </h2>
            {users.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-orange-50 border p-4 rounded-lg mb-2"
              >
                <div>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                </div>
                {user._id !== admin.id && (
                  <div className="space-x-2">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleDemote(user._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePromote(user._id)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                      >
                        Promote to Admin
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case "dashboard":
      default:
        return (
          <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-orange-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg font-medium text-gray-600 text-center mb-6">
              Welcome back, {displayName}! Use the sidebar to manage books.
            </p>

            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-100 p-4 rounded-xl shadow">
                  <h2 className="text-xl font-semibold text-orange-800 mb-2">
                    Library Stats Overview
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barStatsData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#FF7F50"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-orange-100 p-4 rounded-xl shadow">
                  <h2 className="text-xl font-semibold text-orange-800 mb-2">
                    Borrowed vs Returned Books
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={borrowReturnData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#00C49F"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
              </div>
              
            ) : (
              <p className="text-center text-gray-500">Loading stats...</p>
            )}
            <AdminFines/>
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
              crossOrigin="anonymous"
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

            <button
              onClick={() => setSelectedSection("manage-users")}
              className={`w-full py-2 px-4 rounded-lg text-left font-semibold transition duration-200 ${
                selectedSection === "manage-users"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-gray-800 hover:bg-orange-200"
              }`}
            >
              Manage Users
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
