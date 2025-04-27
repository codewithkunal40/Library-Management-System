import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = "http://localhost:3000/api/auth";

const AuthPopup = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        role: "user",
    });

    const handleSendOtp = async () => {
        try {
        const { data } = await axios.post(`${BACKEND_URL}/send-otp`, { email });
        toast.success(data.message);
        setStep(2);
        } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleRegister = async () => {
        try {
        const { data } = await axios.post(`${BACKEND_URL}/register`, {
            ...formData,
            email,
            otp,
        });
        toast.success("Registration Successful!");
        console.log("User:", data);
        } catch (error) {
        toast.error(error.response?.data?.message || "Registration Failed");
        }
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md relative">
            <h2 className="text-2xl font-bold mb-4 text-center">
            {step === 1 ? "Enter Email" : "Complete Registration"}
            </h2>

            {step === 1 && (
            <>
                <input
                type="email"
                className="w-full p-2 border mb-4 rounded"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                Send OTP
                </button>
            </>
            )}

            {step === 2 && (
            <>
                <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-2 border mb-2 rounded"
                onChange={handleChange}
                />
                <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border mb-2 rounded"
                onChange={handleChange}
                />
                <select
                name="role"
                className="w-full p-2 border mb-2 rounded"
                onChange={handleChange}
                >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                </select>
                <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-2 border mb-4 rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                />
                <button
                onClick={handleRegister}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                Sign Up
                </button>
            </>
            )}
        </div>
        </div>
    );
};

export default AuthPopup;
