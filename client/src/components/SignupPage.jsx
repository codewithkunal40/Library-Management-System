import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FiCamera, FiUserPlus } from "react-icons/fi";

function SignupPage() {
  const initialFormState = {
    fullName: "",
    phone: "",
    dob: "",
    country: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profilePic) {
      toast.error("Please upload a profile picture.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("profilePic", profilePic);

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.msg || "Signup failed");
      }

      toast.success("Registration successful!");
      setShowPopup(true);
      setFormData(initialFormState);
      setProfilePic(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        navigate("/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover relative px-4"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dhtl10m17/image/upload/v1745999239/library_bg_1_iccxly.png')",
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl bg-white bg-opacity-90 shadow-2xl rounded-3xl p-6 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-orange-500 tracking-tight">
          <span className="text-gray-800">Complete your</span> Profile{" "}
          <span className="text-gray-800">&</span> Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm px-6 font-bold sm:text-base">
          Don’t worry, only you can see your personal data.
        </p>

        {/* Profile Upload Section */}
        <div className="flex justify-center items-center mb-6">
          <div
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-orange-300 cursor-pointer transition-all hover:shadow-lg group"
            onClick={handleImageClick}
            title="Click to upload"
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-500">
                <FiUserPlus className="text-4xl sm:text-5xl" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-orange-500 p-1.5 sm:p-2 rounded-full shadow-md group-hover:scale-110 transition-transform">
              <FiCamera className="text-white text-lg sm:text-xl" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {[
            { name: "fullName", placeholder: "Full Name" },
            { name: "phone", placeholder: "Phone" },
            { name: "dob", type: "date", placeholder: "Date of Birth" },
            { name: "country", placeholder: "Country" },
            { name: "username", placeholder: "Username" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "password", type: "password", placeholder: "Password" },
            {
              name: "confirmPassword",
              type: "password",
              placeholder: "Confirm Password",
            },
          ].map(({ name, type = "text", placeholder }) => (
            <input
              key={name}
              name={name}
              type={type}
              value={formData[name]}
              placeholder={placeholder}
              onChange={handleChange}
              required
              className="w-full bg-orange-50/50 border border-orange-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          ))}

          <div className="sm:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
          <div className="bg-white rounded-3xl shadow-2xl px-6 py-8 w-full max-w-md text-center relative">
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-orange-500"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <img
              src={preview}
              alt="Success"
              className="w-20 mx-auto mb-4 rounded-full border-4 border-orange-200"
              style={{ boxShadow: "0 0 10px 3px rgba(255, 165, 0, 0.15)" }}
            />
            <h3 className="text-xl sm:text-2xl font-bold text-orange-500 mb-2">
              Registration Successful!
            </h3>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Your account has been created. Please wait a moment while we
              prepare your profile.
            </p>
            <div className="flex justify-center mt-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupPage;
