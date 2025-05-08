import express from "express";
import { addBook, getAllBooks } from "../controllers/bookController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// admin add book
router.post("/add-book", protect, isAdmin, addBook);

// user and admin booth can view book
router.get("/get-book", protect, getAllBooks);

export default router;
