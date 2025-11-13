// models/Finance.js
import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    providerName: { type: String, required: true },
    jobCategory: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Finance = mongoose.model("Finance", financeSchema);
export default Finance;
