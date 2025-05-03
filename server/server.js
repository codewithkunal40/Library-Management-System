import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import configurePassport from './passport.js';

dotenv.config();
const app = express();

configurePassport();


app.use(
  session({
    secret: "cyberwolve",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());


app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

connectDB();
