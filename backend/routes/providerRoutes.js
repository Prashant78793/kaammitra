import express from "express";
import { addProvider, getProviders, getProviderStats } from "../controllers/providerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProviders);
router.get("/stats", getProviderStats);

// Protected route (optional, if only admin can add)
router.post("/add", protect, addProvider);

export default router;
