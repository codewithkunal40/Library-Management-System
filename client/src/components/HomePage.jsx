import libraryImage from "../assets/libraray Image 2.webp";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-black p-6 gap-8">
      <div className="flex-1 flex justify-center">
        <img
          src={libraryImage}
          alt="Library"
          className="w-full max-w-md object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
          Welcome to the Library Management System
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
          Effortlessly browse, borrow, and manage books online. Join us to
          explore a world of knowledge at your fingertips!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
