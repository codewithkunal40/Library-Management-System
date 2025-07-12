import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa";
import EditBookModal from "../EditBookModel/EditBookModal";
import DeletePopup from "./DeletePopup";
import { toast } from "react-toastify";
import PDFViewerModal from "../PDFViewerModal";
import RatingModal from "../RatingModal";

const ViewBooks = ({ filters = {}, mode = "browse" }) => {
  const [books, setBooks] = useState([]);
  const [, setError] = useState("");
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [currentPDF, setCurrentPDF] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingBookId, setRatingBookId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserRole(storedUser?.role || "user");
  }, []);

  useEffect(() => {
    fetchBorrowedBooks();
    fetchBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        "http://localhost:3000/api/borrow/borrowed",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch borrowed books");
      setBorrowedBooks(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized. Please login.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/books/get-book", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch books.");
      setBooks(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const isBookBorrowed = (bookId) =>
    borrowedBooks.some(
      (b) => (b.bookId?._id || b.bookId) === bookId && !b.isReturned
    );

  const getUserRating = (bookId) => {
    const match = borrowedBooks.find(
      (b) => (b.bookId?._id || b.bookId) === bookId
    );
    return match?.userRating || null;
  };

  const hasAccessToPDF = (bookId) => isBookBorrowed(bookId);

  const handleBorrow = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/borrow/borrow/${bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to borrow book");
      toast.success(data.message);
      fetchBorrowedBooks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReturn = (bookId) => {
    setRatingBookId(bookId);
    setShowRatingModal(true);
  };

  const confirmReturnWithRating = async (bookId, ratingValue) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/borrow/return/${bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: ratingValue }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to return book");
      toast.success(data.message);
      fetchBorrowedBooks();
      fetchBooks();
      setShowRatingModal(false);
      setRatingBookId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async (book) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/books/delete-book/${book._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book.");
      }
      toast.success(data.message || "Book deleted successfully!");
      setBooks((prevBooks) => prevBooks.filter((b) => b._id !== book._id));
      setDeleteBook(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  let visibleBooks = books;
  if (mode === "borrowed") {
    const borrowedIds = borrowedBooks
      .filter((b) => !b.isReturned)
      .map((b) => b.bookId?._id || b.bookId);
    visibleBooks = books.filter((book) => borrowedIds.includes(book._id));
  }

  const filteredBooks = visibleBooks.filter((book) => {
    const nameMatch = book.title
      .toLowerCase()
      .includes(filters.name?.toLowerCase() || "");
    const genreMatch = book.genre
      .toLowerCase()
      .includes(filters.genre?.toLowerCase() || "");
    return nameMatch && genreMatch;
  });

  const groupBooksByGenre = (books) => {
    return books.reduce((acc, book) => {
      const genre = book.genre || "Other";
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push(book);
      return acc;
    }, {});
  };

  const groupedBooks = groupBooksByGenre(filteredBooks);

  if (!userRole)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="relative">
      <div
        className={`px-4 sm:px-6 py-6 ${
          showPDFModal || showRatingModal
            ? "blur-sm pointer-events-none select-none"
            : ""
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">
          {mode === "borrowed" ? "My Library (Borrowed Books)" : "All Books"}
        </h1>

        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-600 font-medium">
            No books found with the given filters.
          </p>
        ) : (
          Object.keys(groupedBooks).map((genre) => (
            <div key={genre} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                {genre}
              </h2>

              <div className="flex overflow-x-auto gap-4 pb-4">
                {groupedBooks[genre].map((book) => {
                  const borrowed = isBookBorrowed(book._id);
                  const canViewPDF = hasAccessToPDF(book._id) && book.pdfPath;
                  const userRating = getUserRating(book._id);

                  return (
                    <div
                      key={book._id}
                      className="bg-white shadow-md rounded-xl p-4 pb-10 border border-gray-200 flex flex-col relative flex-shrink-0 w-72"
                    >
                      {userRole === "admin" && (
                        <div className="absolute bottom-3 right-3 flex gap-3">
                          <button
                            className="text-orange-500 hover:text-orange-700 text-sm"
                            onClick={() => setEditBook(book)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-orange-500 hover:text-orange-700 text-sm"
                            onClick={() => setDeleteBook(book)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col h-full">
                        <div className="w-full aspect-[3/4] relative mb-4 rounded overflow-hidden">
                          <img
                            src={`http://localhost:3000/${book.coverImage.replace(
                              /\\/g,
                              "/"
                            )}`}
                            alt={book.title}
                            crossOrigin="anonymous"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>

                        <h2 className="text-lg font-bold text-gray-800">
                          {book.title}
                        </h2>
                        <p className="text-gray-600">Author: {book.author}</p>
                        <p className="text-gray-600 flex items-center">
                          Rating: {renderStars(book.rating)}
                          <span className="ml-2 text-sm text-gray-500">
                            ({book.rating?.toFixed(1) || 0}/5)
                          </span>
                        </p>

                        {userRole === "user" && (
                          <p className="text-gray-600 flex items-center">
                            User's Rating:{" "}
                            {userRating ? (
                              <>
                                {renderStars(userRating)}
                                <span className="ml-2 text-sm text-gray-500">
                                  ({userRating.toFixed(1)}/5)
                                </span>
                              </>
                            ) : (
                              <span className="ml-2 text-sm italic font-bold text-gray-800">
                                Unrated
                              </span>
                            )}
                          </p>
                        )}

                        <p className="text-gray-600">ISBN: {book.isbn}</p>
                        <p className="text-gray-600">Genre: {book.genre}</p>
                        <p className="text-gray-600">Price: ₹{book.price}</p>

                        <p className="text-gray-600 mt-2 line-clamp-4 overflow-hidden">
                          Description: {book.description}
                        </p>

                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                          Added on: {new Date(book.createdAt).toLocaleString()}
                          {isRecentlyAdded(book.createdAt) && (
                            <span className="bg-green-100 text-green-600 whitespace-nowrap px-2 py-0.5 rounded-full text-xs font-semibold">
                              Recently Added
                            </span>
                          )}
                        </p>

                        {userRole === "user" && (
                          <div className="mt-auto pt-3 space-y-2">
                            {mode === "borrowed" ? (
                              <>
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
                                  onClick={() => handleReturn(book._id)}
                                >
                                  Return
                                </button>
                                <button
                                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded w-full font-medium ${
                                    canViewPDF
                                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                  }`}
                                  disabled={!canViewPDF}
                                  onClick={() => {
                                    if (canViewPDF) {
                                      setCurrentPDF(book.pdfPath);
                                      setShowPDFModal(true);
                                    }
                                  }}
                                >
                                  <FaFilePdf />
                                  View PDF
                                </button>
                              </>
                            ) : (
                              <button
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
                                onClick={() => handleBorrow(book._id)}
                                disabled={borrowed}
                              >
                                {borrowed ? "Borrowed" : "Borrow"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {(showRatingModal || showPDFModal) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          {showPDFModal && (
            <PDFViewerModal
              isOpen={true}
              onClose={() => setShowPDFModal(false)}
              pdfPath={currentPDF}
            />
          )}
          {showRatingModal && (
            <RatingModal
              isOpen={true}
              onClose={() => setShowRatingModal(false)}
              onSubmit={(rating) =>
                confirmReturnWithRating(ratingBookId, rating)
              }
            />
          )}
        </div>
      )}

      <DeletePopup
        isOpen={!!deleteBook}
        onClose={() => setDeleteBook(null)}
        onConfirm={() => confirmDelete(deleteBook)}
        bookTitle={deleteBook?.title}
      />

      {editBook && (
        <EditBookModal
          book={editBook}
          isOpen={!!editBook}
          onClose={() => setEditBook(null)}
          onSave={(updated) =>
            setBooks((prev) =>
              prev.map((b) => (b._id === updated._id ? updated : b))
            )
          }
        />
      )}
    </div>
  );
};

export default ViewBooks;

const isRecentlyAdded = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  return now - createdDate <= 30 * 24 * 60 * 60 * 1000;
};

const renderStars = (rating) =>
  [...Array(5)].map((_, i) => (
    <span
      key={i}
      className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
    >
      ★
    </span>
  ));
