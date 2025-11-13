// controllers/financeController.js
import Finance from "../models/Finance.js";

// ✅ Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Finance.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

// ✅ Add new transaction
export const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Finance(req.body);
    const saved = await newTransaction.save();

    // Send realtime update via socket.io
    const io = req.app.get("io");
    io.emit("newTransaction", saved);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to add transaction", error: err });
  }
};

// ✅ Get total revenue
export const getTotalRevenue = async (req, res) => {
  try {
    const completed = await Finance.find({ status: "Completed" });
    const total = completed.reduce((acc, t) => acc + t.amount, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: "Error calculating revenue" });
  }
};
