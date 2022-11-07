const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { Product } = require("../models");
const ApiError = require("../utils/ApiError");
const { subCategoryService } = require("./index");

const createProduct = async (productBody) => {
  console.log(productBody);

  const product = await Product.create(productBody);
  return product;
};

const getMinMaxPrice = async () => {
  return await Product.aggregate([
    {
      $group: {
        _id: null,
        max: {
          $max: {
            $subtract: ["$price", { $multiply: ["$price", "$discount"] }],
          },
        },
        min: {
          $min: {
            $subtract: ["$price", { $multiply: ["$price", "$discount"] }],
          },
        },
      },
    },
  ]);
};

const getAllProduct = async (queriesData) => {
  let listIdSubCate = (await subCategoryService.getAllSubCategory()).map(
    (sub) => sub._id
  );
  const arrayMinMax = await getMinMaxPrice();
  const page = parseInt(queriesData?.skip) || 1;
  const perPage = parseInt(queriesData?.limit) || 12;
  const searchKey = queriesData?.s || "";
  if (queriesData?.cate) {
    listIdSubCate = (await subCategoryService.getAllSubCategory())
    .filter((sub) => sub.category.toString() === queriesData.cate)
    .map((sub) => sub._id);
  }
  const arrSubCate = queriesData?.subcate
    ? [queriesData?.subcate]
    : [...listIdSubCate];

  return await Product.aggregate([
    {
      $addFields: {
        priceDis: {
          $subtract: ["$price", { $multiply: ["$price", "$discount"] }],
        },
      },
    },
    {
      $match: {
        subCategory: {
          $in: arrSubCate,
        },
        priceDis: {
          $gte: queriesData.min || arrayMinMax[0].min,
          $lte: queriesData.max || arrayMinMax[0].max,
        },
        productName: { $regex: new RegExp(searchKey, "i") },
        discount: { $gte: 0, $lte: 1 },
      },
    },
  ])
    .skip(perPage * page - perPage)
    .limit(perPage);
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProductById = async (id, productBody) => {
  const product = await getProductById(id);
  Object.assign(product, productBody);
  await product.save();
  return product;
};

const deleteProductById = async (id) => {
  const product = await getProductById(id);
  await product.remove();
  return product;
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
