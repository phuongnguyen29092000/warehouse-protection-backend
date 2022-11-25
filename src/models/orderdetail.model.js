const mongoose = require("mongoose");

const orderDetailSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
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
  },
  {
    timestamps: true,
  }
);

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);

module.exports = OrderDetail;
