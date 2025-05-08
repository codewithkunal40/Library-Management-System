import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from './routes/bookRoutes.js';
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes); // user and admin
app.use('/api/books', bookRoutes); // books

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

connectDB();
