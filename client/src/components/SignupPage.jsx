import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FiCamera, FiUserPlus } from "react-icons/fi";

export default function SignupPage() {
  const initialFormState = {
    fullName: "",
    phone: "",
    dob: "",
    city: "",
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
  const [errors, setErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const fileInputRef = useRef(null);
  const usernameCheckTimeoutRef = useRef(null);

  // Validation regex
  const validateFullName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      setUsernameAvailable(null);
      if (usernameCheckTimeoutRef.current)
        clearTimeout(usernameCheckTimeoutRef.current);
      usernameCheckTimeoutRef.current = setTimeout(() => {
        checkUsernameAvailability(value);
      }, 500);
    }

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === "fullName") {
        if (!validateFullName(value))
          newErrors.fullName =
            "Full Name must contain only letters and spaces.";
        else delete newErrors.fullName;
      }

      if (name === "phone") {
        if (!validatePhone(value))
          newErrors.phone = "Phone number must be exactly 10 digits.";
        else delete newErrors.phone;
      }

      if (usernameAvailable === false)
      newErrors.username = "Username is already taken.";

      if (name === "password" || name === "confirmPassword") {
        const passwordVal = name === "password" ? value : formData.password;
        const confirmVal =
          name === "confirmPassword" ? value : formData.confirmPassword;
        if (passwordVal !== confirmVal) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else {
          delete newErrors.confirmPassword;
        }
      }

      return newErrors;
    });
  };

  const checkUsernameAvailability = async (username) => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/check-username?username=${username}`
      );
      const data = await res.json();
      if (res.ok && data.available) {
        setUsernameAvailable(true);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
      } else {
        setUsernameAvailable(false);
        setErrors((prev) => ({
          ...prev,
          username: "Username is already taken.",
        }));
      }
    } catch {
      setUsernameAvailable(null);
    }
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

  const validateBeforeSubmit = () => {
    const newErrors = {};
    if (!validateFullName(formData.fullName))
      newErrors.fullName = "Full Name must contain only letters and spaces.";
    if (!validatePhone(formData.phone))
      newErrors.phone = "Phone number must be exactly 10 digits.";
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (usernameAvailable === false)
      newErrors.username = "Username is already taken.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!profilePic) newErrors.profilePic = "Please upload a profile picture.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) {
      toast.error("Please fix the errors before submitting.");
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
      setErrors({});
      setUsernameAvailable(null);
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
          "url('https://res.cloudinary.com/dhtl10m17/image/upload/v1748065677/Libarary_image_ksw2a6.jpg')",
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
        {errors.profilePic && (
          <p className="text-red-600 text-sm text-center mb-4">
            {errors.profilePic}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {[
            { name: "fullName", placeholder: "Full Name" },
            { name: "phone", placeholder: "Phone" },
            { name: "dob", type: "date", placeholder: "Date of Birth" },
            { name: "city", placeholder: "City" },
            { name: "username", placeholder: "Username" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "password", type: "password", placeholder: "Password" },
            {
              name: "confirmPassword",
              type: "password",
              placeholder: "Confirm Password",
            },
          ].map(({ name, type = "text", placeholder }) => (
            <div key={name} className="relative">
              <input
                name={name}
                type={type}
                value={formData[name]}
                placeholder={placeholder}
                onChange={handleChange}
                required
                className={`w-full bg-orange-50/50 border border-b-4 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 transition ${
                  errors[name]
                    ? "border-red-600 focus:ring-red-500"
                    : "border-orange-200 focus:ring-orange-400"
                }`}
              />
              {name === "username" && usernameAvailable === true && (
                <p className="text-green-600 text-xs mt-1">
                  Username available ✓
                </p>
              )}
              {errors[name] && (
                <p className="text-red-600 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={
                Object.keys(errors).length > 0 ||
                !formData.fullName ||
                !formData.phone ||
                !formData.username ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                !profilePic
              }
              className={`inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-white text-lg font-semibold shadow-lg hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              Signup <FiUserPlus />
            </button>
          </div>
        </form>

        {showPopup && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-400 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg z-50">
            Account created successfully! Redirecting to login...
          </div>
        )}
      </div>
    </div>
  );
}

