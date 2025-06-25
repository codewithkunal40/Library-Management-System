import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./firebase.js";
import { signInWithPopup } from "firebase/auth";

const WelcomePage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white animate-fadeIn">
        <img
          src="https://res.cloudinary.com/dhtl10m17/image/upload/v1746200403/ebook_logo_1_dtzq3j.png"
          crossOrigin="anonymous"
          alt="Splash"
          className="w-3/4 max-w-xs mb-4"
        />
        <h1 className="text-5xl font-bold text-orange-500">LMS</h1>
      </div>
    );
  }

  return (
    <div className="h-[100vh] min-h-screen flex flex-col items-center justify-between bg-white pb-30">
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
        <h1 className="text-5xl font-bold text-black mb-2 text-center">
          Welcome to <span className="text-orange-500">E-Library</span>
        </h1>
        <p className="text-gray-600 text-center mb-6 text-lg">
          The Number one ebook store and reading application in this century
        </p>

        <div className="flex items-center mb-8">
          <div className="h-2 w-6 bg-orange-500 rounded-full mx-1"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
        </div>

        <button
          onClick={() => navigate("/gender-page")}
          className="w-full max-w-xs bg-orange-500 text-white py-3 rounded-full font-semibold mb-4 hover:bg-orange-600 transition cursor-pointer"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full max-w-xs bg-orange-100 text-orange-500 py-3 rounded-full font-semibold hover:bg-orange-200 transition mb-3"
        >
          I already have an account
        </button>

        <p className="font-bold">or</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full max-w-xs max-h-12 bg-white text-black border border-gray-300 py-3 rounded-full font-semibold mb-4 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-3 cursor-pointer"
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

export default WelcomePage;
