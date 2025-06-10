import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditBookModal from "../EditBookModel/EditBookModal";
import DeletePopup from "./DeletePopup";
import { toast } from "react-toastify";

const ViewBooks = ({ filters = {} }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [userRole, setUserRole] = useState("user");
  //for borrow and return feature
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
  const fetchBorrowedBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:3000/api/borrow/my-books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch borrowed books");
      const data = await response.json();
      setBorrowedBooks(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };
  fetchBorrowedBooks();
}, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "admin") {
      setUserRole("admin");
    } else {
      setUserRole("user");
    }

    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please login.");
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/api/books/get-book", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
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
      toast.success(`"${deleteBook.title}" deleted successfully!`);
    } catch (err) {
      toast.error(err.message);
      setDeleteBook(null);
    }
  };

  const isBookBorrowed = (bookId) => {
  return borrowedBooks.some(
    (b) => b.bookId._id === bookId && !b.isReturned
  );
};


  const handleBorrow = async (bookId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:3000/api/borrow/borrow/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to borrow book");
    toast.success(data.message);
    // Refresh borrowed books
    setBorrowedBooks((prev) => [
      ...prev,
      { bookId: { _id: bookId }, isReturned: false },
    ]);
  } catch (err) {
    toast.error(err.message);
  }
};

const handleReturn = async (bookId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:3000/api/borrow/return/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to return book");
    toast.success(data.message);
    // Refresh borrowed books
    setBorrowedBooks((prev) =>
      prev.map((b) =>
        b.bookId._id === bookId ? { ...b, isReturned: true } : b
      )
    );
  } catch (err) {
    toast.error(err.message);
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

  const filteredBooks = books.filter((book) => {
    const nameMatch = book.title.toLowerCase().includes(filters.name?.toLowerCase() || "");
    const genreMatch = book.genre.toLowerCase().includes(filters.genre?.toLowerCase() || "");
    return nameMatch && genreMatch;
  });

  if (error) {
    return <p className="text-red-600 font-semibold text-center">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">All Books</h1>
      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-600 font-medium">
          No books found with the given filters.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
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
                    <h2 className="text-lg font-bold text-gray-800">{book.title}</h2>
                    <p className="text-gray-600">Author: {book.author}</p>
                    <p className="text-gray-600 flex items-center">
                      Rating: {renderStars(book.rating)}
                      <span className="ml-2 text-sm text-gray-500">({book.rating}/5)</span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">ISBN: {book.isbn}</p>
                <p className="text-gray-600">Genre: {book.genre}</p>
                <p className="text-gray-600">Price: ₹{book.price}</p>
                <p className="text-gray-600 mb-2">Description: {book.description}</p>
                <p className="text-sm text-gray-500">
                  Added on: {new Date(book.createdAt).toLocaleString()}
                </p>
              </div>

              {userRole === "admin" && (
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
              )}
              {userRole === "user" && (
                <div className="mt-3">
                  {!isBookBorrowed(book._id) ? (
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                      onClick={() => handleBorrow(book._id)}
                    >
                      Borrow
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      onClick={() => handleReturn(book._id)}
                    >
                      Return
                    </button>
                  )}
                </div>
              )}

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
