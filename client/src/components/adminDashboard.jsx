import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
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

  return admin ? (
    <div className="flex h-screen">
      <aside className="w-full sm:w-64 bg-gray-800 text-white flex flex-col justify-between p-4">
        <div>
          <div className="flex flex-col items-center mb-6">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-2 object-cover"
            />
            <h2 className="text-lg font-semibold text-center">{displayName}</h2>
            <p className="text-sm text-gray-300 font-bold text-center">
              Email: {admin.email}
            </p>
            <p className="text-sm text-gray-300 font-bold text-center">
              Role: Admin
            </p>
          </div>

          <nav>
            <ul>
              <li className="mb-2">
                <Link to='/add-books' className="block px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                  Add Books
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded text-center mt-4"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
        <p className="mt-2 font-bold text-gray-700">
          Welcome to your dashboard, {displayName}!
        </p>
      </main>
    </div>
  ) : null;
};

export default AdminDashboard;
