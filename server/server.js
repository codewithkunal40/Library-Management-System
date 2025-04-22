import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection.js";

dotenv.config();

const app = express();

const PORT =process.env.PORT || 5000;

connectDB();

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`);
})