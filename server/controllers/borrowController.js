import BorrowedBook from "../models/borrowedBookModel.js";
import Book from "../models/bookModel.js";

export const borrowBook = async (req, res) => {
  const userId = req.userId;
  const bookId = req.params.bookId;

  try {
    // Check borrowed and not returned
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
    const books = await BorrowedBook.find({ userId: req.userId }).populate(
      "bookId"
    );
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
