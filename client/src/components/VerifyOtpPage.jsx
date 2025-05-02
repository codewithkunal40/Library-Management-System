import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VerifyOtpPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [timer, setTimer] = useState(60);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    useEffect(() => {
        const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join("");
        if (fullOtp.length !== 6 || newPassword.length < 6) {
        toast.error("Enter 6-digit OTP and a valid new password");
        return;
        }

        try {
        const res = await axios.post("http://localhost:3000/api/auth/reset-password", {
            email,
            otp: fullOtp,
            newPassword,
        });
        toast.success(res.data.msg || "Password updated successfully");
        navigate("/login");
        } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to verify OTP");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-white pb-16 animate-fadeIn">
        <div className="relative w-full h-[28vh]">
            <img
            src="https://res.cloudinary.com/dhtl10m17/image/upload/v1745999239/library_bg_1_iccxly.png"
            alt="Library"
            className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>

        <div className="text-center mt-8">
            <h2 className="text-5xl font-extrabold text-black mb-3">You have got a mail!</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
            We have sent the OTP verification code to your email address. Please check your mail and enter the code below.
            </p>

            <form onSubmit={handleVerify} className="flex flex-col items-center gap-6">
            <div className="flex gap-3">
                {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
                />
                ))}
            </div>

            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-4 w-64 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
                required
            />

            <button
                type="submit"
                className="w-40 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full"
            >
                Confirm
            </button>

            <p className="text-gray-600 text-sm">
                Didn’t receive a code? <br />
                You can resend code in{" "}
                <span className="text-orange-500 font-semibold">{timer} sec</span>
            </p>
            </form>
        </div>
        </div>
    );
}

export default VerifyOtpPage;
