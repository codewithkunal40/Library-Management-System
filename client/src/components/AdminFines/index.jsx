import { useEffect, useState } from "react";

const AdminFines = () => {
  const [userFines, setUserFines] = useState([]);

  useEffect(() => {
    const fetchUserFines = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/borrow/all-fines", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setUserFines(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserFines();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">User Fine Records </h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-orange-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Total Fine (₹)</th>
          </tr>
        </thead>
        <tbody>
          {userFines.map((user) => (
            <tr key={user.userId}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.userId}</td>
              <td className="border px-4 py-2">{user.totalFine}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFines;
