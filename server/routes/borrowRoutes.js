import express from "express";

import {
  borrowBook,
  returnBook,
  getUserBorrowedBooks,
} from "../controllers/borrowController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/borrow/:bookId", verifyToken, borrowBook);
router.post("/return/:bookId", verifyToken, returnBook);
router.get("/my-books", verifyToken, getUserBorrowedBooks);

export default router;
