import express from "express";
import { addBook, getAllBooks } from "../controllers/bookController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadBookImage.js";

const router = express.Router();

// admin add book
router.post(
  "/add-book",
  protect,
  isAdmin,
  upload.single("coverImage"),
  addBook
);

// user and admin both can view books
router.get("/get-book", protect, getAllBooks);

export default router;
