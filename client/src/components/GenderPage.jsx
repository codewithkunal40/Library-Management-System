import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GenderPage = () => {
    const navigate = useNavigate();
    const [selectedGender, setSelectedGender] = useState("male");

    return (
        <div className="h-[100vh] min-h-screen flex flex-col items-center justify-between bg-white pb-40 animate-fadeIn">
            <div className="relative w-full h-[45vh]">
                <img
                    src="https://res.cloudinary.com/dhtl10m17/image/upload/v1745999239/library_bg_1_iccxly.png"
                    alt="Library"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            <div className="w-full flex flex-col items-center px-6 py-10 bg-white">
                <h1 className="text-5xl font-bold text-black mb-2 text-center">
                    What's your <span className="text-orange-500">Gender?</span>
                </h1>
                <p className="text-gray-600 text-lg text-center mb-6">
                    Select gender for better content
                </p>

                <div className="flex items-center mb-8">
                    <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                    <div className="h-2 w-6 bg-orange-500 rounded-full mx-1"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                </div>

                <div className="flex justify-center items-center 
                w-full max-w-2xl 
                bg-white border border-gray-300 rounded-full 
                px-6 py-1 
                space-x-15 mb-6
                shadow-sm
                transition-all duration-200">
            {["male", "female", "notsay"].map((gender) => (
                <label
                key={gender}
                className={`
                    flex items-center space-x-3 text-md text-gray-700 cursor-pointer
                    px-3 py-2 rounded-full transition
                    hover:bg-orange-50
                    ${selectedGender === gender ? "font-semibold text-orange-600" : ""}
                `}
                >
                <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={selectedGender === gender}
                    onChange={() => setSelectedGender(gender)}
                    className="form-radio text-orange-500 focus:ring-orange-500"
                />
                <span>
                    {gender === "male"
                    ? "I am a Male"
                    : gender === "female"
                    ? "I am a Female"
                    : "Rather Not To say"}
                </span>
                </label>
            ))}
            </div>

                <button
                    onClick={() => navigate("/age-page")}
                    className="w-full max-w-xs bg-orange-500 text-white py-3 rounded-full font-semibold mb-4 hover:bg-orange-600 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default GenderPage;
