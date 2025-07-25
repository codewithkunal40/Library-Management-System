import { useState } from "react";
import { auth, provider } from "./firebase.js";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const res = await fetch("http://localhost:3000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          profilePic: firebaseUser.photoURL,
        }),
      });

      const data = await res.json();

      if (data.token && data.user) {
        const userWithRole = {
          ...data.user,
          role: data.user.role || "user",
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userWithRole));

        import("axios").then((axiosModule) => {
          axiosModule.default.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.token}`;
        });

        navigate("/user-dashboard");
      } else {
        toast.error(data.msg || "Google login failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error", error);
      toast.error("Google login error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (data.token && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data?.token);

        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        toast.error(data.msg || "Login failed");
      }
    } catch (error) {
      toast.error("Login error: " + error.message);
    }
  };

  return (
    <div className="h-[100vh] min-h-screen flex flex-col items-center justify-between bg-white pb-40 animate-fadeIn">
            <div className="relative w-full h-[45vh]">
        <img
          src="https://res.cloudinary.com/dhtl10m17/image/upload/v1748065677/Libarary_image_ksw2a6.jpg"
          crossOrigin="anonymous"
          alt="Library"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <div className="w-full flex flex-col items-center px-6 py-10 bg-white">
        <h1 className="text-6xl font-bold text-black mb-2 text-center">
          Hello <span className="text-orange-500">There!</span>
        </h1>
        <p className="text-gray-600 text-center mb-6 text-lg">
          Please enter your email/username and password to login
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-sm">
          <input
            name="identifier"
            placeholder="Email or Username"
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
          <p
            onClick={() => navigate("/forget-password")}
            className="text-orange-500 underline text-end mb-3 cursor-pointer"
          >
            Forgot Password?
          </p>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold mb-4 hover:bg-orange-600 transition"
            >
              Login
            </button>
          </div>
        </form>

        <p className="font-bold">or</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full max-w-xs max-h-12 bg-white text-black border border-gray-300 py-3 rounded-full font-semibold mb-4 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-3"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            crossOrigin="anonymous"
            alt="Google Logo"
            className="h-5 w-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
