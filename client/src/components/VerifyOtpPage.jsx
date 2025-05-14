import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VerifyOtpPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [timer, setTimer] = useState(60);
    const [showPopup, setShowPopup] = useState(false);

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
        const res = await fetch("http://localhost:3000/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                otp: fullOtp,
                newPassword,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || "Failed to verify OTP");
        }

        toast.success(data.msg || "Password updated successfully");
        setShowPopup(true);
    } catch (err) {
        toast.error(err.message || "Failed to verify OTP");
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

            {/* OTP and Password Form */}
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
                        className="w-40 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full cursor-pointer"
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

            {/* Popup Page */}
            {showPopup && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 max-w-md w-full text-center border-gray-800 relative animate-fadeIn">
                <img
                    src="https://res.cloudinary.com/dhtl10m17/image/upload/v1746035428/account_circle_pyc8sx.png"
                    alt="Success"
                    className="w-20 mx-auto mb-4 rounded-full"
                    style={{ boxShadow: "0 0 6px 5px rgba(255, 165, 0, 0.5)" }}
                />
                <h3 className="text-xl font-semibold text-orange-500 mb-4">
                    Password Reset Successful!
                </h3>
                <p className="text-md font-semibold">Your password has been successfully changed</p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full cursor-pointer"
                >
                    Go to Login Page
                </button>
                </div>
            </div>
            )}
        </div>
    );
}

export default VerifyOtpPage;
