import express from "express";
import {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getLibraryStats,
} from "../controllers/bookController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Only admin can add a book
router.post(
  "/add-book",
  protect,
  isAdmin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  addBook
);

// Admin and users can view all books
router.get("/get-book", protect, getAllBooks);

// Only admin can update a book
router.put(
  "/update-book/:id",
  protect,
  isAdmin,
  upload.single("coverImage"),
  updateBook
);

// Only admin can delete a book
router.delete("/delete-book/:id", protect, isAdmin, deleteBook);

// Route for stats
router.get("/dashboard-stats", protect, getLibraryStats);

export default router;
