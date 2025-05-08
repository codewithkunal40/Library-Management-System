import Book from "../models/bookModel.js";

//  admin can add books
export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, quantity, description, price } = req.body;

    // Basic required fields validation
    if (!title || !author || !isbn || price === undefined) {
      return res
        .status(400)
        .json({ message: "Title, author, ISBN, and price are required" });
    }

    //  duplicate ISBN
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    // Create the book
    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      quantity,
      description,
      price,
      addedBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
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
