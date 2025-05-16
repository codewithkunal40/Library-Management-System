import React, { useEffect, useState } from "react";

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please login.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/books/get-book",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }

        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please login.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/books/delete-book/${bookId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete book.");
      }

      setBooks(books.filter((book) => book._id !== bookId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <p className="text-red-600 font-semibold text-center">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">
        All Books
      </h1>
      {books.length === 0 ? (
        <p className="text-center text-gray-600 font-medium">
          No books available.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200 relative"
            >
              <div className="flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={`http://localhost:3000/${book.coverImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={book.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex flex-col justify-start">
                    <h2 className="text-lg font-bold text-gray-800">
                      {book.title}
                    </h2>
                    <p className="text-gray-600">Author: {book.author}</p>
                    <p className="text-gray-600">ISBN: {book.isbn}</p>
                  </div>
                </div>
                <p className="text-gray-600">Genre: {book.genre}</p>
                <p className="text-gray-600">Price: ₹{book.price}</p>
                <p className="text-gray-600">Quantity: {book.quantity}</p>
                <p className="text-gray-600 mb-2">
                  Description: {book.description}
                </p>
                <p className="text-sm text-gray-500">
                  Added on: {new Date(book.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(book._id)}
                className="absolute bottom-3 right-3 text-red-500 hover:text-red-700 transition"
                title="Delete Book"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBooks;
