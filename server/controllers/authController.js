import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// === REGISTER ===
export const register = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dob,
      city,
      username,
      email,
      password,
      confirmPassword,
    } = req.body;

    // === Form Validations ===
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(fullName)) {
      return res.status(400).json({ msg: "Full name must contain only letters and spaces." });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ msg: "Phone number must be exactly 10 digits." });
    }

    if (!dob || isNaN(Date.parse(dob))) {
      return res.status(400).json({ msg: "Invalid date of birth." });
    }

    if (!username || username.length < 3) {
      return res.status(400).json({ msg: "Username must be at least 3 characters long." });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ msg: "Invalid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords don't match." });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User with this email or username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePic = req.file ? req.file.filename : "";

    const user = await User.create({
      fullName,
      phone,
      dob,
      city,
      username,
      email,
      password: hashedPassword,
      role: "user",
      profilePic,
    });

    res.status(201).json({ msg: "Registered Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// === LOGIN ===
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// === SEND OTP ===
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp: otpCode });
    await sendEmail(email, "OTP for Password Reset", `Your OTP is: ${otpCode}`);

    res.json({ msg: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// === RESET PASSWORD ===
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord)
      return res.status(400).json({ msg: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteMany({ email });

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
