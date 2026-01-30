import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  fullName: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, "Full name must only contain letters and spaces."],
  },

  phone: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits."],
  },

  dob: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
  },

  city: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
  },

  profilePic: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export default mongoose.model("User", userSchema);
