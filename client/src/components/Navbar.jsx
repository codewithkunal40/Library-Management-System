import { Link } from "react-router-dom";

const Navbar = ({ setShowPopup }) => {
  return (
    <nav className="bg-blue-900 shadow-md p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="text-red-500 hover:text-red-600 font-medium">
          Home
        </Link>
        <Link
          to="/about"
          className="text-red-500 hover:text-red-600 font-medium"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Contact
        </Link>
        <Link
          to="/login"
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Login
        </Link>
        <button
          onClick={() => setShowPopup(true)}
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Sign Up
        </button>
      </div>
      <div className="text-2xl font-bold text-red-500">
        Library Management System
      </div>
    </nav>
  );
};

export default Navbar;
