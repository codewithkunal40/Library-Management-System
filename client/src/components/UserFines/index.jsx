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
        <div className="mt-10 p-4 border rounded-md bg-yellow-50 shadow-md">
        <h2 className="text-xl font-bold mb-3 text-yellow-800">Pending Fines</h2>
        <p className="mb-2 text-gray-700">Total Fine: ₹{totalFine}</p>
        <ul className="space-y-3">
            {fines.map((fine) => (
            <li
                key={fine.borrowId}
                className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
                <div>
                <p className="text-gray-800 font-medium">{fine.bookTitle}</p>
                <p className="text-sm text-gray-600">Fine: ₹{fine.fine}</p>
                </div>
                <button
                onClick={() => handlePayFine(fine.borrowId)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
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
