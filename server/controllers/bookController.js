import Book from "../models/bookModel.js";
import path from "path";
import fs from "fs";
import BorrowedBook from "../models/borrowedBookModel.js";

// Admin can add a book with cover image
export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, rating, description, price } = req.body;

    if (!isbn) return res.status(400).json({ message: "ISBN is required" });
    const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/;
    if (!isbnRegex.test(isbn))
      return res.status(400).json({ message: "Invalid ISBN format" });
    if (!title || !author || price === undefined) {
      return res
        .status(400)
        .json({ message: "Title, author, ISBN, and price are required" });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook)
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });

    let coverImagePath = "";
    let pdfPath = "";
    if (req.files?.coverImage) {
      coverImagePath = path.join(
        "uploads",
        "books",
        req.files.coverImage[0].filename
      );
    }
    if (req.files?.pdf) {
      pdfPath = path.join("uploads", "pdfs", req.files.pdf[0].filename);
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      rating,
      description,
      price,
      coverImage: coverImagePath,
      pdfPath,
      addedBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE book
export const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedData = req.body;

    const oldBook = await Book.findById(bookId);

    if (req.file) {
      if (oldBook && oldBook.coverImage) {
        const imagePath = path.join(process.cwd(), oldBook.coverImage);
        fs.unlink(imagePath, (err) => {
          if (err) console.log("Old image delete error:", err);
        });
      }
      updatedData.coverImage = path.join("uploads", "books", req.file.filename);
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update book" });
  }
};

// DELETE book
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find and delete the book
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.coverImage) {
      const imagePath = path.join(process.cwd(), book.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Image delete error:", err);
        });
      } else {
        console.warn(
          "Cover image file not found, skipping deletion:",
          imagePath
        );
      }
    }

    if (book.pdf) {
      const pdfPath = path.join(process.cwd(), book.pdf);
      if (fs.existsSync(pdfPath)) {
        fs.unlink(pdfPath, (err) => {
          if (err) console.error("PDF delete error:", err);
        });
      } else {
        console.warn("PDF file not found, skipping deletion:", pdfPath);
      }
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete book" });
  }
};

//  CONTROLLER for user dashboard stats

export const getLibraryStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalBooks = await Book.countDocuments();
    const userBorrowedBooks = await BorrowedBook.find({ userId });

    const borrowedCount = userBorrowedBooks.length;
    const notReturnedCount = userBorrowedBooks.filter(
      (b) => !b.isReturned
    ).length;

    res.status(200).json({
      totalBooks,
      borrowedCount,
      notReturnedCount,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch library stats" });
  }
};
