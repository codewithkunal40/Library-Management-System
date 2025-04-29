import express from "express";
import passport from "passport";
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

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    message: "Log In Failure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

export default router;
