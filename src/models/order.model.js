import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },
  orderId: {
    type: String,
  },
  selectedType: {
    type: String,
    required: true,
    enum: ["wet", "dry", "recycle"],
    default: "recycle",
  },
  selectedDate: {
    type: Date,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
