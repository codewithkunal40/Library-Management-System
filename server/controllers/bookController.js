import Book from "../models/bookModel.js";
import path from "path";
import fs from "fs";

// Admin can add a book with cover image
export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, rating, description, price } =
      req.body;

    //  if ISBN is provided
    if (!isbn) {
      return res.status(400).json({ message: "ISBN is required" });
    }

    const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/;
    if (!isbnRegex.test(isbn)) {
      return res.status(400).json({ message: "Invalid ISBN format" });
    }

    if (!title || !author || price === undefined) {
      return res
        .status(400)
        .json({ message: "Title, author, ISBN, and price are required" });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    let coverImagePath = "";
    if (req.file) {
      coverImagePath = path.join("uploads", "books", req.file.filename);
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

    // Fetch the old book
    const oldBook = await Book.findById(bookId);

    if (req.file) {
      // Delete the old image if it exists
      if (oldBook && oldBook.coverImage) {
        const imagePath = path.join(process.cwd(), oldBook.coverImage);
        fs.unlink(imagePath, err => {
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
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.coverImage) {
      // Use the correct absolute path
      const imagePath = path.join(process.cwd(), book.coverImage);
      fs.unlink(imagePath, (err) => {
        if (err) console.log("Image delete error:", err);
      });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete book" });
  }
};
