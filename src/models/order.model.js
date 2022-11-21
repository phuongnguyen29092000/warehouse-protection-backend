const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalProduct: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: Boolean,
      default: "PENDING",
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
