import express from "express";
import multer from "multer";
import { createJob, getJobs, getJobById } from "../controllers/jobController.js";

const router = express.Router();

// ✅ File upload setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Routes
router.post("/", upload.single("image"), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById); // new route for single job

export default router;
