const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    buyer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      minlength: 0,
      maxlength: 1024,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
