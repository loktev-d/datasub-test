import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  cardNumber: { type: String, required: true, match: new RegExp("^\\d{16}$") },
  expirationDate: { type: Date, required: true },
  cvv: { type: String, required: true, match: new RegExp("^\\d{3}$") },
  amount: { type: Number, required: true },
});

export default model("Payment", paymentSchema);
