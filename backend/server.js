import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// ensure uploads folder exists
const uploadsPath = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 'uploads' folder created automatically");
}

// CORS
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// serve uploads
app.use("/uploads", express.static(uploadsPath));
console.log("🖼️ Serving images from:", uploadsPath);

// root
app.get("/", (req, res) => {
  res.send("✅ Backend server is running...");
});

// socket.io
const io = new Server(server, {
  cors: { origin: FRONTEND_ORIGIN, credentials: true },
});
app.set("io", io);

// register routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/finance", financeRoutes);

// MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dashboardDB";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// socket events
io.on("connection", async (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  try {
    const Customer = (await import("./models/Customer.js")).default;
    const count = await Customer.countDocuments();
    socket.emit("customerCount", { count });
  } catch (e) {
    console.error("Socket customer count error:", e.message);
  }

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
