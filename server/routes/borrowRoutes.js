import express from "express";
import {
  borrowBook,
  returnBook,
  getUserBorrowedBooks,
  viewBookPDF,
} from "../controllers/borrowController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/borrow/:bookId", verifyToken, borrowBook);
router.post("/return/:bookId", verifyToken, returnBook);
router.get("/my-books", verifyToken, getUserBorrowedBooks);
router.get("/view-pdf/:bookId", verifyToken, viewBookPDF); // NEW

export default router;