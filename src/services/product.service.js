const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { Product } = require("../models");
const ApiError = require("../utils/ApiError");
const { subCategoryService } = require("./index");

const createProduct = async (productBody) => {
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
  let disValue = [0, 1];
  const arrayMinMax = await getMinMaxPrice();
  const page = parseInt(queriesData?.skip) || 1;
  const perPage = parseInt(queriesData?.limit) || 12;
  const searchKey = queriesData?.s || "";
  if (queriesData?.dis?.toString() === "true") {
    disValue = [0.000000001, 1];
  }
  if (queriesData?.cate) {
    listIdSubCate = (await subCategoryService.getAllSubCategory())
      .filter((sub) => sub.category.toString() === queriesData.cate)
      .map((sub) => sub._id);
  }
  const arrSubCate = queriesData?.subcate
    ? [mongoose.Types.ObjectId(queriesData?.subcate)]
    : [...listIdSubCate];

  return await Product.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "manufacturer",
        foreignField: "_id",
        as: "manufacturer",
      },
    },
    { $unwind: "$user" },
    { $unwind: "$manufacturer" },
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
          $gte: parseInt(queriesData.min) || arrayMinMax[0].min,
          $lte: parseInt(queriesData.max) || arrayMinMax[0].max,
        },
        productName: { $regex: new RegExp(searchKey, "i") },
        discount: { $gte: disValue[0], $lte: disValue[1] },
      },
    },
  ])
    .skip(perPage * page - perPage)
    .limit(perPage);
};

const getTotalCountAllProduct = async (queriesData) => {
  let listIdSubCate = (await subCategoryService.getAllSubCategory()).map(
    (sub) => sub._id
  );
  let disValue = [0, 1];
  const arrayMinMax = await getMinMaxPrice();
  const searchKey = queriesData?.s || "";
  if (queriesData?.dis?.toString() === "true") {
    disValue = [0.000000001, 1];
  }
  if (queriesData?.cate) {
    listIdSubCate = (await subCategoryService.getAllSubCategory())
      .filter((sub) => sub.category.toString() === queriesData.cate)
      .map((sub) => sub._id);
  }
  const arrSubCate = queriesData?.subcate
    ? [mongoose.Types.ObjectId(queriesData?.subcate)]
    : [...listIdSubCate];

  return await Product.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "manufacturer",
        foreignField: "_id",
        as: "manufacturer",
      },
    },
    { $unwind: "$user" },
    { $unwind: "$manufacturer" },
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
          $gte: parseInt(queriesData.min) || arrayMinMax[0].min,
          $lte: parseInt(queriesData.max) || arrayMinMax[0].max,
        },
        productName: { $regex: new RegExp(searchKey, "i") },
        discount: { $gte: disValue[0], $lte: disValue[1] },
      },
    },
  ])
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
  getTotalCountAllProduct
};
