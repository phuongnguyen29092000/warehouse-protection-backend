const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const options = {
  lang: "en",
};
mongoose.plugin(slug, options);

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 0,
      maxlength: 50,
      required: true,
    },
    description: {
      type: String,
      minlength: 0,
      maxlength: 1024,
      required: true,
    },
    slug: {
      type: String,
      slug: "name",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;