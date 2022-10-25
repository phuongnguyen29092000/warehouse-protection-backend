const mongoose = require("mongoose");
const continents = require("../config/continents");
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
      maxlength: 1024,
      required: true,
    },
    imageSlide: [
      {
        type: String,
        required: false,
        index: true,
        trim: true,
        maxlength: 500,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 500000000,
    },
    dateOfInventory: {
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
      min: 50,
      default: 100,
    },
    discount: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
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
    slug: {
      type: String,
      slug: "productName",
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
