/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ViewBooks from "./ViewBooks/ViewBooks";
import UserFines from "./UserFines";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("home");
  const [filters, setFilters] = useState({ name: "", genre: "" });
  const [stats, setStats] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/");
    else setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/books/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const displayName =
    user?.displayName || user?.name || user?.username || "User";
  const profileImage = user?.profilePic
    ? `http://localhost:3000/uploads/profiles/${user.profilePic}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleSearchInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const renderStatsChart = () => {
    if (!stats) return null;
    const chartData = [
      { name: "Total Books", value: stats.totalBooks },
      { name: "Borrowed", value: stats.borrowedCount },
      { name: "Not Returned", value: stats.notReturnedCount },
    ];

    return (
      <div className="mt-8 bg-orange-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-orange-800">
          Your Library Activity
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#fb923c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const renderMainContent = () => {
    switch (selectedSection) {
      case "view-books":
        return <ViewBooks filters={filters} mode="browse" />;
      case "search-books":
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">
              Search Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleSearchInputChange}
                placeholder="Search by Book Name"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                name="genre"
                value={filters.genre}
                onChange={handleSearchInputChange}
                placeholder="Search by Genre"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <ViewBooks filters={filters} mode="browse" />
          </div>
        );
      case "my-library":
        return <ViewBooks mode="borrowed" />;
      case "home":
      default:
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold text-orange-800 mb-2 text-center">
              User Dashboard
            </h1>
            <p className="text-gray-700 text-center font-medium">
              Welcome back, {displayName}! Use sidebar for borrowing and
              searching books 👍
            </p>
            {renderStatsChart()}
            <UserFines
              userId={user?._id}
              token={localStorage.getItem("token")}
            />
          </div>
        );
    }
  };

  return user ? (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 relative">
      <div className="md:hidden flex items-center justify-between bg-orange-200 p-4 shadow">
        <h1 className="text-xl font-bold text-orange-800">User Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-orange-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-row">
        <aside
          className={`bg-white shadow-xl w-72 h-screen absolute top-0 left-0 z-30 transition-transform duration-300 ease-in-out transform
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:flex md:flex-col md:fixed md:top-0 md:left-0 p-6 md:rounded-tr-3xl md:rounded-br-3xl`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-col items-center mb-6">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow mb-2 object-cover"
                  crossOrigin="anonymous"
                />
                <h2 className="text-xl font-bold text-center">{displayName}</h2>
                <p className="text-sm text-gray-500 text-center">
                  {user?.email}
                </p>
              </div>

              <nav className="mt-8">
                <ul className="space-y-2">
                  {[
                    { key: "home", label: "Home" },
                    { key: "view-books", label: "View All Books" },
                    { key: "search-books", label: "Search Books" },
                    { key: "my-library", label: "My Library" },
                  ].map((section) => (
                    <li key={section.key}>
                      <button
                        onClick={() => {
                          setSelectedSection(section.key);
                          setIsSidebarOpen(false);
                        }}
                        className={`block w-full ${
                          selectedSection === section.key
                            ? "bg-orange-500 text-white"
                            : "bg-orange-100 text-gray-800 hover:bg-orange-200"
                        } font-semibold py-2 px-4 rounded-lg text-start transition duration-200`}
                      >
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 rounded-lg transition duration-200 mt-6"
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

export default UserDashboard;