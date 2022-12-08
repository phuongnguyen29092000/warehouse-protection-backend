const mongoose = require("mongoose");
const order_status = require('../config/order_status')

const orderSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String
    },
    details: [{
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      priceDis: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
    phoneNumber: {
      type: String,
      require: true
    },
    note: {
      type: String,
    },
    address: {
      type: String,
      require: true
    },
    isRated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
