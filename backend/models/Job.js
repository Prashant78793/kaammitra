import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    customer: { type: String },
    provider: { type: String },
    category: { type: String },
    subService: { type: String },
    description: { type: String },
    requirement: { type: String },
    image: { type: String },
    status: { type: String, default: "Pending" },
    date: { type: String },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
