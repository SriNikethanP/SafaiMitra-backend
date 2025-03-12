import express from "express";
import Order from "../models/order.model.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { user, selectedType, selectedDate, address, location } = req.body;

    // Validate required fields
    if (!user || !selectedType || !selectedDate || !address || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new order
    const newOrder = new Order({
      user,
      selectedType,
      selectedDate,
      address,
      location: {
        lat: parseFloat(location.lat),
        long: parseFloat(location.long),
      },
    });

    // Save order to DB
    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

export default router;
