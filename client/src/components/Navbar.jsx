import { Link } from "react-router-dom";

const Navbar = ({ setShowPopup }) => {
  return (
    <nav className="bg-blue-900 shadow-md p-4 flex justify-between items-center pl-10 pr-10">
      <div className="text-2xl font-bold text-yellow-500 hover:text-red-600">
        Library Management System
      </div>
      <div className="flex space-x-4">
        <Link to="/" className="text-yellow-500 hover:text-red-600 font-medium">
          Home
        </Link>
        <Link
          to="/about"
          className="text-yellow-500 hover:text-red-600 font-medium"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-yellow-500 hover:text-red-600 font-medium"
        >
          Contact
        </Link>
        <Link
          to="/login"
          className="text-yellow-500 hover:text-red-600 font-medium"
        >
          Login
        </Link>
        <button
          onClick={() => setShowPopup(true)}
          className="text-yellow-500 hover:text-red-600 font-medium"
        >
          Sign Up
        </button>
      </div>
      
    </nav>
  );
};

export default Navbar;
