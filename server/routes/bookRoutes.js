import express from "express";
import {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  searchBooks,
} from "../controllers/bookController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadBookImage.js";

const router = express.Router();

// ✅ Only admin can add a book
router.post(
  "/add-book",
  protect,
  isAdmin,
  upload.single("coverImage"),
  addBook
);

// ✅ Admin and users can view all books
router.get("/get-book", protect, getAllBooks);

// ✅ Search books by title, author, genre, or ISBN
router.get("/search", protect, searchBooks);

// ✅ Only admin can update a book
router.put(
  "/update-book/:id",
  protect,
  isAdmin,
  upload.single("coverImage"),
  updateBook
);

// ✅ Only admin can delete a book
router.delete("/delete-book/:id", protect, isAdmin, deleteBook);

export default router;
