import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { itemsRouter } from "./routes/item.js";
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/items", itemsRouter);

const DB_url = process.env.DB_URL;

mongoose.connect(DB_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(3001, () => console.log("Server started"));