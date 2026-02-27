import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserFines = () => {
    const [fines, setFines] = useState([]);
    const [totalFine, setTotalFine] = useState(0);

    useEffect(() => {
        fetchFines();
    }, []);

    const fetchFines = async () => {
        const token = localStorage.getItem("token");
        try {
        const response = await fetch("http://localhost:3000/api/borrow/fines", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch fines");
        const data = await response.json();
        setFines(data.fines);
        setTotalFine(data.totalFine);
        } catch (err) {
        toast.error(err.message);
        }
    };

    const handlePayFine = async (borrowId) => {
        const token = localStorage.getItem("token");
        try {
        const response = await fetch(
            `http://localhost:3000/api/borrow/pay-fine/${borrowId}`,
            {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to pay fine");

        toast.success(data.message);
        fetchFines(); 
        } catch (err) {
        toast.error(err.message);
        }
    };

    if (fines.length === 0) return null;

    return (
        <div className="mt-10 p-4 border rounded-md bg-yellow-50 shadow-md w-full max-w-xl lg:max-w-full lg:mx-0">
    <h2 className="text-2xl font-semibold mb-4 text-yellow-900 text-center sm:text-left">
        Pending Fines
    </h2>

    <p className="mb-4 text-gray-700 text-center sm:text-left text-lg">
        Total Fine: <span className="font-semibold text-red-600">₹{totalFine}</span>
    </p>

    <ul className="space-y-4">
        {fines.map((fine) => (
        <li
            key={fine.borrowId}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded-lg shadow transition hover:shadow-md"
        >
            <div className="mb-2 sm:mb-0">
            <p className="text-gray-900 font-medium text-base sm:text-lg">
                {fine.bookTitle}
            </p>
            <p className="text-sm text-gray-600 mt-1">
                Fine: ₹{fine.fine}
            </p>
            </div>

            <button
            onClick={() => handlePayFine(fine.borrowId)}
            className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300 text-white px-5 py-2 rounded-md text-sm font-medium transition w-full sm:w-auto"
            >
            Pay Fine
            </button>
        </li>
        ))}
    </ul>
    </div>


    );
};

export default UserFines;

