// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, unique: false }, // optional unique: true if desired
    status: { type: String, enum: ["Active", "Suspended", "Pending"], default: "Active" },
    joined: { type: String }, // you used strings like "10/09/2024" previously
    actions: { type: Number, default: 0 }, // number of actions/uses
    image: { type: String }, // will store path like '/uploads/12345-filename.jpg'
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
