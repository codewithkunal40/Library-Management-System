import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewBooks from "./ViewBooks/ViewBooks";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("home");
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
    user?.photoURL ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const renderMainContent = () => {
    switch (selectedSection) {
      case "view-books":
        return <ViewBooks />;
      case "home":
      default:
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">
              User Dashboard
            </h1>
            <p className="text-gray-700 text-center font-medium">
              Welcome back, {displayName}!
            </p>
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
            <p className="text-sm text-gray-300 text-center">
              {user.email}
            </p>
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
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {renderMainContent()}
      </main>
    </div>
  ) : null;
};

export default UserDashboard;
