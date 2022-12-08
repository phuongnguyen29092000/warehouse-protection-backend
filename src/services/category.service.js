const httpStatus = require("http-status");
const { Category } = require("../models");
const ApiError = require("../utils/ApiError");
const { getAllSubCategory } = require("./subcategory.service");

const createCategory = async (categoryBody) => {
  const category = await Category.create(categoryBody);
  return category;
};

const getAllCategory = async () => {
  const subCategories = await getAllSubCategory();
  return (await Category.find())
    .map((cat) => {
      return {
        parent: cat,
      };
    })
    .map((cat) => {
      const childs = subCategories.filter(
        (sub) => sub.category._id.toString() === cat.parent._id.toString()
      );
      return {
        ...cat,
        childrens: [...childs],
      };
    });
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const updateCategoryById = async (id, catBody) => {
  const category = await getCategoryById(id);
  Object.assign(category, catBody);
  await category.save();
  return category;
};

const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);
  await category.remove();
  return category;
};

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
