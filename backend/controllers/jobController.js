import Job from "../models/Job.js";

/** ✅ CREATE JOB */
export const createJob = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { category, subService, description, requirement, status } = req.body;

    const jobId = `#tf${Math.floor(1000 + Math.random() * 9000)}`;

    const job = new Job({
      jobId,
      customer: "New Customer",
      provider: "Pending",
      category,
      subService,
      description,
      requirement,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      status: status || "Pending",
      date: new Date().toLocaleDateString(),
    });

    await job.save();

    if (io) io.emit("jobAdded", job); // emit real-time event

    return res.status(201).json(job);
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** ✅ GET ALL JOBS */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("getJobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** ✅ GET SINGLE JOB BY ID */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
