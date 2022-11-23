const mongoose = require("mongoose");
const order_status = require('../config/order_status')

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
      type: String,
      default: order_status[0],
      enum: order_status
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
