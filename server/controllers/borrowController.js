import BorrowedBook from "../models/borrowedBookModel.js";
import Book from "../models/bookModel.js";
import path from "path";
import { calculateFine } from "../utils/calculateFine.js";

//  Borrow Book blocks if fine exists
export const borrowBook = async (req, res) => {
  const userId = req.userId;
  const bookId = req.params.bookId;

  try {
    // Block borrow if user has any unpaid fine
    const unpaidFineBorrow = await BorrowedBook.findOne({
      userId,
      isReturned: false,
      finePaid: false,
    });

    if (unpaidFineBorrow && calculateFine(unpaidFineBorrow.borrowDate) > 0) {
      return res
        .status(403)
        .json({
          message:
            "You have unpaid fines. Please pay before borrowing new books.",
        });
    }

    // Block if already borrowed this book
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

// Return Book
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

// Get All Borrowed Books by User
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

// View Book PDF if Currently Borrowed
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
      return res
        .status(403)
        .json({ message: "You have not currently borrowed this book." });
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

//  Get User Fines
export const getUserFines = async (req, res) => {
  try {
    const userId = req.userId;

    const pendingBorrows = await BorrowedBook.find({
      userId,
      isReturned: false,
      finePaid: false,
    }).populate("bookId");

    const fineDetails = pendingBorrows.map((borrow) => {
      const fine = calculateFine(borrow.borrowDate);
      return {
        borrowId: borrow._id,
        bookTitle: borrow.bookId.title,
        fine,
      };
    });

    const totalFine = fineDetails.reduce((acc, curr) => acc + curr.fine, 0);

    res.status(200).json({ totalFine, fines: fineDetails });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pay Fine
export const payFine = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrowRecord = await BorrowedBook.findById(borrowId);
    if (!borrowRecord)
      return res.status(404).json({ message: "Borrow record not found" });

    const fine = calculateFine(borrowRecord.borrowDate);

    if (fine <= 0) return res.status(400).json({ message: "No fine to pay" });

    borrowRecord.finePaid = true;
    await borrowRecord.save();

    res
      .status(200)
      .json({ message: `Fine of ₹${fine} paid successfully`, amount: fine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/borrowController.js

export const getAllUsersFines = async (req, res) => {
  try {
    const pendingBorrows = await BorrowedBook.find({
      isReturned: false,
      finePaid: false,
    }).populate("userId").populate("bookId");

    const userFinesMap = new Map();

    for (const borrow of pendingBorrows) {
      const fine = calculateFine(borrow.borrowDate);
      if (fine <= 0) continue;

      const userId = borrow.userId._id.toString();
      const name = borrow.userId.name || borrow.userId.username || borrow.userId.email;

      if (!userFinesMap.has(userId)) {
        userFinesMap.set(userId, { userId, name, totalFine: 0 });
      }

      userFinesMap.get(userId).totalFine += fine;
    }

    const result = Array.from(userFinesMap.values());

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching all user fines:", err);
    res.status(500).json({ message: err.message });
  }
};
