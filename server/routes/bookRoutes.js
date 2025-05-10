import express from "express";
import {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadBookImage.js";

const router = express.Router();

// only admin can Add Book
router.post(
  "/add-book",
  protect,
  isAdmin,
  upload.single("coverImage"),
  addBook
);

//  Admin and user both can view all Books
router.get("/get-book", protect, getAllBooks);

// admin can update Book
router.put(
  "/update-book/:id",
  protect,
  isAdmin,
  upload.single("coverImage"),
  updateBook
);

// admin can delete Book
router.delete("/delete-book/:id", protect, isAdmin, deleteBook);

export default router;
