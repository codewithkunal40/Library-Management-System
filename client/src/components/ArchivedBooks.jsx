import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ArchivedBooks = () => {
  const [archivedBooks, setArchivedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivedBooks = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:3000/api/books/archived-books",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch archived books.");
        }

        setArchivedBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedBooks();
  }, []);

  const getDeletedBy = (deletedBy) => {
    if (!deletedBy) return "Unknown";

    if (typeof deletedBy === "string") return deletedBy;

    if (typeof deletedBy === "object") {
      return deletedBy.fullName || deletedBy.email || "Unknown";
    }

    return "Unknown";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center">
        Archived Books
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading archived books...</p>
      ) : archivedBooks.length === 0 ? (
        <p className="text-center text-gray-500">No archived books found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-md border border-gray-200 rounded-xl p-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {book?.title || "Untitled"}
              </h3>

              <p className="text-gray-600">Author: {book?.author || "N/A"}</p>
              <p className="text-gray-600">Genre: {book?.genre || "N/A"}</p>
              <p className="text-gray-600">ISBN: {book?.isbn || "N/A"}</p>
              <p className="text-gray-600">Price: ₹{book?.price ?? "N/A"}</p>

              <p className="text-gray-600 mt-2 line-clamp-4">
                Description: {book?.description || "No description available."}
              </p>

              <p className="text-sm text-gray-500 mt-3">
                Deleted By:{" "}
                <span className="font-medium">
                  {getDeletedBy(book?.deletedBy)}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                Deleted On:{" "}
                {book?.createdAt
                  ? new Date(book.createdAt).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedBooks;
