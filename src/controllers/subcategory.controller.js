const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { subCategoryService } = require("../services");

/* create new type place */
const createSubCategory = catchAsync(async (req, res) => {
  const subCategory = await subCategoryService.createSubCategory(req.body);
  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create successfully",
    subCategory: subCategory,
  });
});
/* get all type place */
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

/* get SubCategory detail by params id */
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

/* update type place detail by params id*/
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

/* delete type place by params id */
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
