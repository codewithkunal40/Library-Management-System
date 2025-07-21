/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBooks from "./AddBooks/AddBookForm";
import ViewBooks from "./ViewBooks/ViewBooks";
import ArchivedBooks from "./ArchivedBooks";
import { AnimatePresence, motion } from "framer-motion";
import AdminFines from "./AdminFines";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [borrowStats, setBorrowStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [memberHistory, setMemberHistory] = useState([]);
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

    const fetchBorrowStats = async () => {
      try {
        const res = await fetch("/api/borrow/admin/borrow-return-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) setBorrowStats(data);
      } catch (err) {
        console.error("Failed to fetch borrow stats", err);
      }
    };

    if (admin) {
      fetchStats();
      fetchBorrowStats();
    }
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

  const fetchMemberHistory = async () => {
    try {
      const res = await fetch("/api/admin/member-history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setMemberHistory(data);
    } catch (err) {
      console.error("Failed to fetch member history", err);
    }
  };

  useEffect(() => {
    if (selectedSection === "manage-users") fetchUsers();
    if (selectedSection === "member-history") fetchMemberHistory();
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

  const barStatsData =
    stats && borrowStats
      ? [
          { name: "Users", value: stats.totalUsers },
          { name: "Books", value: stats.totalBooks },
          { name: "Borrowed", value: borrowStats.totalBorrowed },
          { name: "Returned", value: borrowStats.totalReturned },
        ]
      : [];

  const borrowReturnData = borrowStats
    ? [
        { name: "Borrowed", value: borrowStats.totalBorrowed },
        { name: "Returned", value: borrowStats.totalReturned },
      ]
    : [];

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const renderMainContent = () => {
    switch (selectedSection) {
      case "view-books":
        return <ViewBooks />;
      case "add-books":
        return <AddBooks />;
      case "archived-books":
        return <ArchivedBooks />;
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
      case "member-history":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-7xl mx-auto overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-orange-800 text-center">
              Member's Library History
            </h2>
            <div className="min-w-[900px]">
              <table className="w-full border border-gray-300 text-base">
                <thead className="bg-orange-200 text-gray-800 font-semibold">
                  <tr>
                    <th className="px-6 py-3 border">#</th>
                    <th className="px-6 py-3 border">Name</th>
                    <th className="px-6 py-3 border">Email</th>
                    <th className="px-6 py-3 border text-center">
                      Total Borrowed
                    </th>
                    <th className="px-6 py-3 border text-center">Returned</th>
                    <th className="px-6 py-3 border text-center">
                      Not Returned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memberHistory.length > 0 ? (
                    memberHistory.map((user, index) => (
                      <tr
                        key={index}
                        className="bg-orange-50 hover:bg-orange-100"
                      >
                        <td className="px-6 py-3 border">{index + 1}</td>
                        <td className="px-6 py-3 border">{user.name}</td>
                        <td className="px-6 py-3 border">{user.email}</td>
                        <td className="px-6 py-3 border text-center">
                          {user.totalBorrowed}
                        </td>
                        <td className="px-6 py-3 border text-center">
                          {user.returned}
                        </td>
                        <td className="px-6 py-3 border text-center">
                          {user.notReturned}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        Loading or no data available...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
            <AdminFines />
          </div>
        );
    }
  };

  return admin ? (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-300">
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-xl font-bold text-orange-800">Admin Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-orange-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col md:flex-row">
        <aside
          className={`bg-white shadow-xl w-72 h-screen absolute top-0 left-0 z-30 transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:flex md:flex-col md:fixed md:top-0 md:left-0 p-6 md:rounded-tr-3xl md:rounded-br-3xl`}
        >
          <div className="flex flex-col justify-between h-full">
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
                <p className="text-sm text-gray-500 font-semibold">
                  Role: Admin
                </p>
              </div>
              <nav className="space-y-2">
                {[
                  { id: "dashboard", label: "Home" },
                  { id: "add-books", label: "Add Books" },
                  { id: "view-books", label: "View Books" },
                  { id: "archived-books", label: "Archived Books" },
                  { id: "manage-users", label: "Manage Users" },
                  { id: "member-history", label: "Member's History" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedSection(id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full py-2 px-4 rounded-lg text-left font-semibold transition duration-200 ${
                      selectedSection === id
                        ? "bg-orange-500 text-white"
                        : "bg-orange-100 text-gray-800 hover:bg-orange-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
              className="w-full mt-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-screen md:ml-72">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSection}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  ) : null;
};

export default AdminDashboard;
