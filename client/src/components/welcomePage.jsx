const WelcomePage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-white pb-10">
            
        <div className="w-full ">
            <img
            src="https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Library"
            className="w-full h-[28.2vh] object-cover"
            />
        </div>

        <div className="w-full flex flex-col items-center px-6 py-10 bg-white">

            <h1 className="text-5xl font-bold text-black mb-2 text-center">
            Welcome to <span className="text-orange-500">E-Library</span>
            </h1>
            <p className="text-gray-600 text-center mb-6">
            The Number one ebook store and reading application in this century
            </p>

            <div className="flex items-center mb-8">
            <div className="h-2 w-6 bg-orange-500 rounded-full mx-1"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
            </div>

            <button className="w-full max-w-xs bg-orange-500 text-white py-3 rounded-full font-semibold mb-4 hover:bg-orange-600 transition">
            Get Started
            </button>

            <button className="w-full max-w-xs bg-orange-100 text-orange-500 py-3 rounded-full font-semibold hover:bg-orange-200 transition mb-3">
            I already have an account
            </button>
            <p className="font-bold">or</p>
            
            <button className="w-full max-w-xs max-h-12 bg-white text-black border border-gray-300 py-3 rounded-full font-semibold mb-4 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-3">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
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
