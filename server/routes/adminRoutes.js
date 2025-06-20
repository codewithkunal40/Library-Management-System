import express from "express";
import {
  getAdminStats,
  getAllUsers,
  promoteUserToAdmin,
  demoteAdminToUser,
} from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getAdminStats);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.put("/promote/:id", verifyToken, isAdmin, promoteUserToAdmin);
router.put("/demote/:id", verifyToken, isAdmin, demoteAdminToUser);

export default router;
