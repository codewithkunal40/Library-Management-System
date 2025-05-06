import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/");
    else setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const displayName =
    user?.displayName || user?.name || user?.username || "User";
  const profileImage =
    user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // default avatar

  return user ? (
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
              Email: {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded text-center"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-center">User Dashboard</h1>
        <p className="mt-2 font-bold text-gray-700">
          Welcome to your dashboard, {displayName}!
        </p>
      </main>
    </div>
  ) : null;
};

export default UserDashboard;
