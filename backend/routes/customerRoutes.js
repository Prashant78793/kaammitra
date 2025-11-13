// routes/customerRoutes.js
import express from "express";
import multer from "multer";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

// multer storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// routes
router.post("/", upload.single("image"), createCustomer);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", upload.single("image"), updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
