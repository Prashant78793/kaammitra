import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Pending", "Suspended"], default: "Pending" },
    jobs: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    address: { type: String },
    joined: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);
