import React, { useState } from "react";

function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        dob: "",
        country: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-white pb-10">
        {/* Background Image */}
        <div className="relative w-full h-[41vh]">
            <img
            src="https://res.cloudinary.com/dhtl10m17/image/upload/v1745999239/library_bg_1_iccxly.png"
            alt="Library"
            className="w-full h-full object-cover"
            />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg px-6 py-8 mt-[-5rem] z-10">
            <h2 className="heading-signup text-4xl font-bold text-center text-orange-500 mb-6">
            <span className="text-black">Complete your</span> Profile <span className="text-black">&</span> Create Account
            </h2>
            <p className="text-center text-black mb-4">
            Don’t worry, only you can see your personal data. No one else will be able to see it.
            </p>
            <div className="flex justify-center items-center">
                <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                <div className="h-2 w-6 bg-orange-500 rounded-full mx-1"></div>
            </div>

            <div className="flex justify-center items-center">
            <img src="https://res.cloudinary.com/dhtl10m17/image/upload/v1746035428/account_circle_pyc8sx.png" alt="account image" className="w-20 mt-3 mb-3"/>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <input
                name="dob"
                type="date"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <input
                name="country"
                placeholder="Country"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
                className="w-full border-b-2 px-3 py-2 border-orange-300"
            />
            <select
                name="role"
                onChange={handleChange}
                className="md:col-span-2 border-b-2 px-3 py-2 border-orange-300"
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <div className="md:col-span-2">
                <button
                type="submit"
                className="w-full max-w-xs bg-orange-500 text-white py-3 rounded-full font-semibold mb-4 hover:bg-orange-600 transition ml-40"
                >
                Register
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}

export default SignupPage