const httpStatus = require("http-status");
const { Category, SubCategory, Product} = require("../models");
const ApiError = require("../utils/ApiError");
const { getAllSubCategory, deleteSubCategoryById } = require("./subcategory.service");

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
  const subCates = await SubCategory.find({category: id})
  if(subCates?.length) {
    for (let i = 0; i < subCates.length; i++) {
      await deleteSubCategoryById(subCates[i]?._id)
    }
  }
  await category.remove();
  return category;
};

const checkExistCategoryProduct = async(id) =>{
  let i = 0
  const len = await SubCategory.find({category: id})
  for (let i = 0; i < len.length; i++) {
    const res = await Product.find({subCategory: len[i]?._id})
    if(res?.length) ++i
  }
  console.log({i});
  return i
}

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  checkExistCategoryProduct
};
