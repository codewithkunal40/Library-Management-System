import Book from "../models/bookModel.js";

//only admin can add books
export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, quantity, description } = req.body;

    if (!title || !author || !isbn) {
      return res
        .status(400)
        .json({ message: "Title, author, and ISBN are required" });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      quantity,
      description,
      addedBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
