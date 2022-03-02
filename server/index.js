import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import { createPayment } from "./controllers/payment-controller.js";
import errorHandler from "./middlewares/error-handler.js";

dotenv.config();
const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.post("/payments", createPayment);
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    app.listen(PORT, () => {
      console.log(`listening on :${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
