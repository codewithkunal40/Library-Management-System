import { useState } from "react";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
        });

        const data = await res.json();
        if (data.token) {
        alert("Login successful");
        } else {
        alert(data.msg || "Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
            <input name="identifier" placeholder="Email or Username" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            <button type="submit" className="bg-orange-500 text-white w-full py-2 rounded">Login</button>
        </form>
        </div>
    );
};

export default LoginPage;
