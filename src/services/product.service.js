const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { Product } = require("../models");
const ApiError = require("../utils/ApiError");
const { subCategoryService } = require("./index");

const createProduct = async (productBody) => {
  const product = await (await Product.create(productBody)).populate("user manufacturer subCategory");
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
      .filter((sub) => sub.category?._id.toString() === queriesData.cate)
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
        isSelling: true,
        productName: { $regex: new RegExp(searchKey, "i") },
        discount: { $gte: disValue[0], $lte: disValue[1] },
      },
    },
    { $sort: { createdAt: -1 } },
  ])
    .skip(perPage * page - perPage)
    .limit(perPage)
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
        isSelling: true,
        priceDis: {
          $gte: parseInt(queriesData.min) || arrayMinMax[0].min,
          $lte: parseInt(queriesData.max) || arrayMinMax[0].max,
        },
        productName: { $regex: new RegExp(searchKey, "i") },
        discount: { $gte: disValue[0], $lte: disValue[1] },
      },
    },
    { $sort: { createdAt: -1 } }
  ])
};

const getProductByCompany = async(idCompany, queriesData) => {
  let listIdSubCate = (await subCategoryService.getAllSubCategory()).map(
    (sub) => sub._id
  );
  let disValue = [0, 1];
  const isSelling = false
  const arrayMinMax = await getMinMaxPrice();
  const page = parseInt(queriesData?.skip) || 1;
  const perPage = parseInt(queriesData?.limit) || 12;
  const searchKey = queriesData?.s || "";
  if (queriesData?.sell?.toString() === "true") {
    isSelling = true
  }
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
  const products = await Product.aggregate([
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
        idCom: '$user._id',
        priceDis: {
          $subtract: ["$price", { $multiply: ["$price", "$discount"] }],
        },
      }
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
        idCom: new mongoose.Types.ObjectId(idCompany),
        productName: { $regex: new RegExp(searchKey, "i") },
        discount: { $gte: disValue[0], $lte: disValue[1] },
      },
    },
    { $sort: { createdAt: -1 } }
  ])
  .skip(perPage * page - perPage)
  .limit(perPage)

  const totalCount = await Product.aggregate([
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
    { $unwind: "$subCategory" },
    { $unwind: "$user" },
    {
      $addFields: {
        idCom: '$user._id',
        priceDis: {
          $subtract: ["$price", { $multiply: ["$price", "$discount"] }],
        },
      }
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
        idCom: new mongoose.Types.ObjectId(idCompany),
        productName: { $regex: new RegExp(searchKey, "i") },
        discount: { $gte: disValue[0], $lte: disValue[1] },
      },
    },
    { $sort: { createdAt: -1 } }
  ])
  return {
    products,
    totalCount: totalCount?.length
  }
}

const getProductById = async (id) => {
  return await Product.findById(id).populate("user manufacturer subCategory");
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

const returnProductToSeller = async(orderDetail) => {
  let count = 0
  for (let i = 0; i < orderDetail?.details?.length; i++) {
    const item =  orderDetail?.details?.[i];
    const {amount} = await Product.findById(item?.product.toString())
    await updateProductById(item?.product.toString(), {amount: amount + item.quantity})
    count++
  }
  return count
}

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getTotalCountAllProduct,
  getProductByCompany,
  returnProductToSeller
};
