const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const options = {
  lang: "en",
};
mongoose.plugin(slug, options);

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      minlength: 0,
      maxlength: 100,
      required: true,
    },
    description: {
      type: String,
      minlength: 20,
      required: true,
    },
    imageUrl: {
      type: String,
      maxlength: 500,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    dateOfManufacture: {
      type: Date,
      required: true,
    },
    warrantyPeriod: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumQuantity: {
      type: Number,
      required: true,
      min: 10,
      default: 100,
    },
    discount: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    isSelling: {
      type: Boolean, 
      default: true, 
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    manufacturer : {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
