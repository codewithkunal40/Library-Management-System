import express from "express";

import {
  register,
  login,
  sendOtp,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/forgot-password", sendOtp);
router.post("/reset-password", resetPassword);

export default router;
