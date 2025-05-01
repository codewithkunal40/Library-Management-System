import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to User Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
