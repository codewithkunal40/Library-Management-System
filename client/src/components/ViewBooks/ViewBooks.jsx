import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditBookModal from "../EditBookModel/EditBookModal";
import DeletePopup from "./DeletePopup";
import { toast } from "react-toastify";

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please login.");
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
        toast.error(err.message)
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = (book) => {
    setDeleteBook(book);
  };

  const confirmDelete = async () => {
    if (!deleteBook) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized. Please login.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/books/delete-book/${deleteBook._id}`,
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
      setBooks(books.filter((book) => book._id !== deleteBook._id));
      setDeleteBook(null);
    } catch (err) {
      toast.error(err.message);
      setDeleteBook(null);
    }
  };

  const handleEdit = (book) => {
    setEditBook(book);
  };

  const handleSave = (updatedBook) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
    );
  };

  if (error) {
    return (
      <p className="text-red-600 font-semibold text-center">{error}</p>
    );
  }

  const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    );
  }
  return stars;
};

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
                    src={`http://localhost:3000/${book.coverImage.replace(/\\/g, "/")}`}
                    alt={book.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex flex-col justify-start">
                    <h2 className="text-lg font-bold text-gray-800">
                      {book.title}
                    </h2>
                    <p className="text-gray-600">Author: {book.author}</p>
                    <p className="text-gray-600">ISBN: {book.isbn}</p>
                    <p className="text-gray-600 flex items-center">
                      Rating: {renderStars(book.rating)} <span className="ml-2 text-sm text-gray-500">({book.rating}/5)</span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">Genre: {book.genre}</p>
                <p className="text-gray-600">Price: ₹{book.price}</p>

                

                <p className="text-gray-600 mb-2">
                  Description: {book.description}
                </p>
                <p className="text-sm text-gray-500">
                  Added on: {new Date(book.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="absolute bottom-3 right-3 flex gap-4">
                <button
                  onClick={() => handleEdit(book)}
                  className="text-orange-500 hover:text-orange-700 transition"
                  title="Edit Book"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(book)}
                  className="text-orange-500 hover:text-orange-700 transition"
                  title="Delete Book"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editBook && (
        <EditBookModal
          book={editBook}
          isOpen={!!editBook}
          onClose={() => setEditBook(null)}
          onSave={handleSave}
        />
      )}
      <DeletePopup
        isOpen={!!deleteBook}
        onClose={() => setDeleteBook(null)}
        onConfirm={confirmDelete}
        bookTitle={deleteBook?.title}
      />
    </div>
  );
};

export default ViewBooks;
