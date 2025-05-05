import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    navigate("/"); 
  };

  return user ? (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome, {user.displayName}</h1>
      <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full mt-2" />
      <p>Email: {user.email}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  ) : null;
};

export default UserDashboard;
