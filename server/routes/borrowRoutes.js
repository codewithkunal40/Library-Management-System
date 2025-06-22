import express from "express";
import {
  borrowBook,
  returnBook,
  getUserBorrowedBooks,
  viewBookPDF,
  getUserFines,
  payFine,
} from "../controllers/borrowController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/borrow/:bookId", verifyToken, borrowBook);
router.post("/return/:bookId", verifyToken, returnBook);
router.get("/borrowed", verifyToken, getUserBorrowedBooks);
router.get("/pdf/:bookId", verifyToken, viewBookPDF);

// fine routes
router.get("/fines", verifyToken, getUserFines);
router.post("/pay-fine/:borrowId", verifyToken, payFine);

export default router;
