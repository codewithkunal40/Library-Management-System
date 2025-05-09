import Book from "../models/bookModel.js";
import path from "path";

// Admin can add a book with cover image
export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, quantity, description, price } =
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
      quantity,
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
