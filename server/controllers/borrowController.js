import BorrowedBook from "../models/borrowedBookModel.js";
import Book from "../models/bookModel.js";
import path from "path";

export const borrowBook = async (req, res) => {
  const userId = req.userId;
  const bookId = req.params.bookId;

  try {
    const alreadyBorrowed = await BorrowedBook.findOne({
      userId,
      bookId,
      isReturned: false,
    });
    if (alreadyBorrowed)
      return res.status(400).json({ message: "Book already borrowed" });

    const borrow = new BorrowedBook({ userId, bookId });
    await borrow.save();
    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const returnBook = async (req, res) => {
  const userId = req.userId;
  const bookId = req.params.bookId;

  try {
    const borrowRecord = await BorrowedBook.findOne({
      userId,
      bookId,
      isReturned: false,
    });
    if (!borrowRecord)
      return res.status(400).json({ message: "No active borrow record found" });

    borrowRecord.isReturned = true;
    borrowRecord.returnDate = new Date();
    await borrowRecord.save();

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserBorrowedBooks = async (req, res) => {
  try {
    const books = await BorrowedBook.find({ userId: req.userId }).populate("bookId");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const viewBookPDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;

    const borrowEntry = await BorrowedBook.findOne({
      userId,
      bookId,
      isReturned: false,
    });

    if (!borrowEntry) {
      return res.status(403).json({ message: "You have not currently borrowed this book." });
    }

    const book = await Book.findById(bookId);
    if (!book || !book.pdfPath) {
      return res.status(404).json({ message: "PDF not found for this book." });
    }

    const pdfFilePath = path.resolve(book.pdfPath);
    res.sendFile(pdfFilePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to serve PDF." });
  }
};
