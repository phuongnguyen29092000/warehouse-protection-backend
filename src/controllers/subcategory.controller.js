const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { subCategoryService } = require("../services");

const createSubCategory = catchAsync(async (req, res) => {
  const subCategory = await subCategoryService.createSubCategory(req.body);
  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create successfully",
    subCategory: subCategory,
  });
});

const getAllSubCategory = catchAsync(async (req, res) => {
  const subCategorys = await subCategoryService.getAllSubCategory();
  if (!subCategorys.length) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "SubCategory not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      subCategorys: subCategorys,
    });
});

const getSubCategoryByCategoryId = catchAsync(async (req, res) => {
  const subCategorys = await subCategoryService.getSubCategoryByCategoryId(req.params.id);
  if (!subCategorys.length) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "SubCategory not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      subCategorys: subCategorys,
    });
});

const getSubCategoryById = catchAsync(async (req, res) => {
  const subcategory = await subCategoryService.getSubCategoryById(req.params.id);

  if (!subcategory) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "SubCategory not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      subCategory: subcategory,
    });
});

const updateSubCategorysById = catchAsync(async (req, res) => {
  const subCategory = await subCategoryService.updateSubCategoryById(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).json({
    status: 200,
    message: "OK",
    subCategory: subCategory,
  });
});

const deleteSubCategoryById = catchAsync(async (req, res) => {
  await subCategoryService.deleteSubCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    status: 204,
    message: "Delete Ok",
  });
});
module.exports = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  updateSubCategorysById,
  deleteSubCategoryById,
  getSubCategoryByCategoryId
};
