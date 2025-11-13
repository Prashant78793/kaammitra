// routes/financeRoutes.js
import express from "express";
import {
  getAllTransactions,
  addTransaction,
  getTotalRevenue,
} from "../controllers/financeController.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.post("/", addTransaction);
router.get("/total", getTotalRevenue);

export default router;
