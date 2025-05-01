import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React, { useState } from "react";
import axios from "axios";

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

    const [formData, setFormData] = useState(initialFormState);
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post(
            "http://localhost:3000/api/auth/signup",
            formData
        );
        console.log("Submitted:", res.data);
        setFormData(initialFormState);
        setShowPopup(true);
        } catch (error) {
        console.error("Signup failed:", error.response?.data || error.message);
        alert("Error occurred while registering.");
        }
    };

    const navigate = useNavigate();

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
        <div className="min-h-screen flex flex-col items-center justify-between bg-white relative">
        <div className="relative w-full h-[18vh]">
            <img
            src="https://res.cloudinary.com/dhtl10m17/image/upload/v1745999239/library_bg_1_iccxly.png"
            alt="Library"
            className="w-full h-full object-cover"
            />
        </div>

        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg px-6 py-8 mt-[-5rem] z-10 mx-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-500 mb-6">
            <span className="text-black">Complete your</span> Profile{" "}
            <span className="text-black">&</span> Create Account
            </h2>
            <p className="text-center text-black mb-4 text-base md:text-lg">
            Don’t worry, only you can see your personal data.
            </p>

            <div className="flex justify-center items-center">
            <img
                src="https://res.cloudinary.com/dhtl10m17/image/upload/v1746035428/account_circle_pyc8sx.png"
                alt="account"
                className="w-20 mt-5 mb-5 rounded-full shadow-lg"
                style={{ boxShadow: "0 0 6px 5px rgba(255, 165, 0, 0.5)" }}
            />
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
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
                className="w-full border-b-2 px-3 py-2 border-orange-300 focus:outline-none"
                />
            ))}

            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="md:col-span-2 border-b-2 px-3 py-2 border-orange-300"
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <div className="md:col-span-2">
                <button
                type="submit"
                className="w-full md:w-1/2 mx-auto bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition block"
                >
                Register
                </button>
            </div>
            </form>
        </div>

        {showPopup && (
            <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-2xl shadow-lg px-6 py-8 max-w-md w-full text-center relative animate-fadeIn">
                <button
                className="absolute top-2 right-3 text-xl text-gray-400 hover:text-black"
                onClick={() => setShowPopup(false)}
                >
                &times;
                </button>
                <img
                src="https://res.cloudinary.com/dhtl10m17/image/upload/v1746035428/account_circle_pyc8sx.png"
                alt="Success"
                className="w-20 mx-auto mb-4 rounded-full"
                style={{ boxShadow: "0 0 6px 5px rgba(255, 165, 0, 0.5)" }}
                />
                <h3 className="text-xl font-semibold text-orange-500 mb-2">
                Registration Successful!
                </h3>
                <p className="text-sm text-gray-700">
                Your account has been created. You can now log in to the system.
                </p>
            </div>
            </div>
        )}
        </div>
    );
}

export default SignupPage;
