// ForgetPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/forgot-password", {
        email,
      });

      toast.success(res.data.msg); 
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white pb-8">
      <div className="relative w-full h-[50vh]">
        <img
          src="https://res.cloudinary.com/dhtl10m17/image/upload/v1745999239/library_bg_1_iccxly.png"
          alt="Library"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <div className="w-full flex flex-col items-center px-6 py-10 bg-white">
        <h1 className="text-6xl font-bold text-black mb-2 text-center">
          Forgot <span className="text-orange-500">Password!</span>
        </h1>
        <p className="text-gray-600 text-center mb-6 text-lg">
          Enter the registered email ID. We will send OTP for verification in the next step.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-sm">
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b-2 px-3 py-2 border-orange-300"
          />
          <div className="flex items-center justify-center mt-5">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold mb-4 hover:bg-orange-600 transition cursor-pointer"
            >
              Get OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPasswordPage;
