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
    <div className="p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-2xl overflow-x-auto">
  <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">User Fine Records</h2>
  
  <table className="min-w-full table-auto border-collapse text-sm md:text-base">
    <thead>
      <tr className="bg-orange-100 text-gray-800">
        <th className="border border-gray-300 px-4 py-3 text-left">Name</th>
        <th className="border border-gray-300 px-4 py-3 text-left">User ID</th>
        <th className="border border-gray-300 px-4 py-3 text-left">Total Fine (₹)</th>
      </tr>
    </thead>
    <tbody>
      {userFines.map((user) => (
        <tr key={user.userId} className="hover:bg-orange-50">
          <td className="border border-gray-200 px-4 py-3">{user.name}</td>
          <td className="border border-gray-200 px-4 py-3">{user.userId}</td>
          <td className="border border-gray-200 px-4 py-3 text-red-600 font-medium">{user.totalFine}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default AdminFines;
