import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AgePage = () => {
    const navigate = useNavigate();
    const [selectedAge, setSelectedAge] = useState(null);

    const ageOptions = ['14-17', '18-24', '25-29', '30-34', '35-49', '>50'];

    return (
        <div className="h-[100vh] min-h-screen flex flex-col items-center justify-between bg-white pb-45 animate-fadeIn">
        <div className="w-full h-[45vh] relative">
            <img
            src="https://res.cloudinary.com/dhtl10m17/image/upload/v1748065677/Libarary_image_ksw2a6.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>

        <div className="w-full flex flex-col items-center px-6 py-10 bg-white">
            <h1 className="text-5xl font-bold text-black mb-2 text-center">
            What's your <span className="text-orange-500">Age Group?</span>
            </h1>
            <p className="text-gray-600 text-lg text-center mb-6">
            Select age group to personalize your experience
            </p>

            <div className="flex items-center mb-8">   
                <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
                <div className="h-2 w-6 bg-orange-500 rounded-full mx-1"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
            {ageOptions.map((age, index) => (
                <button
                key={index}
                className={`px-12 py-3 rounded-full border border-orange-500 text-md font-medium transition-all duration-200
                    ${
                    selectedAge === age
                        ? 'bg-orange-500 text-white'
                        : 'text-orange-500 hover:bg-orange-100'
                    }`}
                onClick={() => setSelectedAge(age)}
                >
                {age}
                </button>
            ))}
            </div>

            <button
                onClick={() => navigate("/signup")}
            className={`w-full max-w-xs bg-orange-500 text-white py-3 rounded-full font-semibold transition ${
                selectedAge ? 'hover:bg-orange-600' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!selectedAge}
            >
            Continue
            </button>
        </div>
        </div>
    );
};

export default AgePage;
