import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React, { useState } from "react";
import { toast } from "react-toastify";

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
        role: "user",
    };

    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialFormState);
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

        const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            // Handle non-2xx responses
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Signup failed");
            }

            const data = await res.json();
            console.log("Submitted:", data);
            setFormData(initialFormState);
            setShowPopup(true);
        } catch (error) {
            console.error("Signup failed:", error.message);
            toast.error(error.message);
            toast.error("Error occurred while registering.");
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

// min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover filter blur-md relative animate-fadeIn
    return (
        <div className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover relative animate-fadeIn"
        style={{
            backgroundImage:
            "url('https://res.cloudinary.com/dhtl10m17/image/upload/v1745999239/library_bg_1_iccxly.png')",
        }}
        >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl bg-white bg-opacity-90 shadow-2xl rounded-3xl px-8 py-8 mx-4">
            <h2 className="text-4xl font-extrabold text-center text-orange-500 tracking-tight drop-shadow">
            <span className="text-gray-800">Complete your</span> Profile{" "}
            <span className="text-gray-800">&</span> Create Account
            </h2>
            <p className="text-center text-gray-500 mb-6 text-lg">
            Don’t worry, only you can see your personal data.
            </p>

            <div className="flex justify-center items-center mb-6">
            <div className="relative">
                <img
                src="https://res.cloudinary.com/dhtl10m17/image/upload/v1746035428/account_circle_pyc8sx.png"
                alt="account"
                className="w-24 h-24 rounded-full shadow-lg border-4 border-orange-200"
                style={{ boxShadow: "0 0 20px 6px rgba(255, 165, 0, 0.1)" }}
                />
                <span className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                New
                </span>
            </div>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {[
                { name: "fullName", placeholder: "Full Name" },
                { name: "phone", placeholder: "Phone" },
                { name: "dob", type: "date", placeholder: "Date of Birth" },
                { name: "country", placeholder: "Country" },
                { name: "username", placeholder: "Username" },
                { name: "email", type: "email", placeholder: "Email" },
                { name: "password", type: "password", placeholder: "Password" },
                { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
            ].map(({ name, type = "text", placeholder }) => (
                <input
                key={name}
                name={name}
                type={type}
                value={formData[name]}
                placeholder={placeholder}
                onChange={handleChange}
                required
                className="w-full bg-orange-50/50 border-b-3 border-orange-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
            ))}

            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="md:col-span-2 bg-orange-50/50 border border-orange-200 border-b-4 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <div className="md:col-span-2 flex justify-center">
                <button
                type="submit"
                className="w-full md:w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
                >
                Register
                </button>
            </div>
            </form>
        </div>

        {/* Success Popup */}
        {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 max-w-md w-full text-center relative border border-orange-100">
                <button
                className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-orange-500 transition"
                onClick={() => setShowPopup(false)}
                >
                &times;
                </button>
                <img
                src="https://res.cloudinary.com/dhtl10m17/image/upload/v1746035428/account_circle_pyc8sx.png"
                alt="Success"
                className="w-20 mx-auto mb-4 rounded-full border-4 border-orange-200"
                style={{ boxShadow: "0 0 10px 3px rgba(255, 165, 0, 0.15)" }}
                />
                <h3 className="text-2xl font-bold text-orange-500 mb-2">
                Registration Successful!
                </h3>
                <p className="text-gray-700 mb-4">
                Your account has been created. Please wait a moment while we prepare your profile.
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
