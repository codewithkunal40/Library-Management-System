import express from "express";
import { getAdminStats, getAllUsers } from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getAdminStats);
router.get("/users", verifyToken, isAdmin, getAllUsers);

export default router;
