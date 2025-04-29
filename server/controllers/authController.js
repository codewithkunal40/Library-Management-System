import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dob,
      country,
      username,
      email,
      password,
      confirmPassword,
      role,
    } = req.body;

    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Passwords don't match" });

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      phone,
      dob,
      country,
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ msg: "Registered Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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
