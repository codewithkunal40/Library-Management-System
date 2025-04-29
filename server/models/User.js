import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  dob: Date,
  country: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const User = mongoose.model("User", userSchema);
export default User;
