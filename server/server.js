import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

connectDB();
app.use(errorMiddleware);
