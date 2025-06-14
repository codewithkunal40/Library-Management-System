import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewBooks from "./ViewBooks/ViewBooks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("home");
  const [filters, setFilters] = useState({ name: "", genre: "" });
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/");
    else setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/books/dashboard-stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
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

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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

  const renderMainContent = () => {
    switch (selectedSection) {
      case "view-books":
        return <ViewBooks showPdfButton userId={user?._id} />;
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
            <ViewBooks filters={filters} showPdfButton userId={user?._id} />
          </div>
        );
      case "home":
      default:
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold text-orange-800 mb-2 text-center">
              User Dashboard
            </h1>
            <p className="text-gray-700 text-center font-medium">
              Welcome back, {displayName}! Use sidebar for borrowing and searching books 👍
            </p>
            {renderStatsChart()}
          </div>
        );
    }
  };

  return user ? (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-orange-100 to-orange-300">
      <aside className="w-full md:w-72 bg-white text-gray-800 shadow-xl p-6 md:rounded-tr-3xl md:rounded-br-3xl flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-6">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow mb-2 object-cover"
            />
            <h2 className="text-xl font-bold text-center">{displayName}</h2>
            <p className="text-sm text-gray-500 text-center">{user?.email}</p>
          </div>

          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedSection("home")}
                  className={`block w-full ${
                    selectedSection === "home"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 text-gray-800 hover:bg-orange-200"
                  } font-semibold py-2 px-4 rounded-lg text-start transition duration-200`}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedSection("view-books")}
                  className={`block w-full ${
                    selectedSection === "view-books"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 text-gray-800 hover:bg-orange-200"
                  } font-semibold py-2 px-4 rounded-lg text-start transition duration-200`}
                >
                  View All Books
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedSection("search-books")}
                  className={`block w-full ${
                    selectedSection === "search-books"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 text-gray-800 hover:bg-orange-200"
                  } font-semibold py-2 px-4 rounded-lg text-start transition duration-200`}
                >
                  Search Books
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{renderMainContent()}</main>
    </div>
  ) : null;
};

export default UserDashboard;
