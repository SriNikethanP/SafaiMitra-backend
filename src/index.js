import express from "express";
import { Server } from "socket.io";
import http from "http";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { ConnectDB } from "./lib/db.js";
import uploadRouter from "./routes/upload.route.js";
import orderRouter from "./routes/order.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins for WebSockets
});

// ✅ Enable CORS for Express routes
app.use(cors({ origin: "*" })); // Allows all domains
app.use(express.json()); // Ensure JSON parsing
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
ConnectDB();

// Driver Schema
const driverSchema = new mongoose.Schema({
  driverId: String,
  latitude: Number,
  longitude: Number,
});
const Driver = mongoose.model("Driver", driverSchema);

// Routes
app.use("/api/auth", authRouter);
app.use("/api", uploadRouter);
app.use("/api/order", orderRouter); // ✅ Moved out of the socket connection

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A driver connected:", socket.id);

  // Listen for driver's actual location updates
  socket.on("updateLocation", async (data) => {
    const { driverId, latitude, longitude } = data;

    await Driver.findOneAndUpdate(
      { driverId },
      { latitude, longitude },
      { upsert: true, new: true }
    );

    // Emit updated location to all clients
    io.emit("driverLocationUpdate", { driverId, latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log("A driver disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
