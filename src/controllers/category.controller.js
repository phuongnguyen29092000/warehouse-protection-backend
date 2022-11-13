const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { categoryService } = require("../services");

/* create new type place */
const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create successfully",
    category: category,
  });
});
/* get all type place */
const getAllCategory = catchAsync(async (req, res) => {
  const categorys = await categoryService.getAllCategory();
  if (!categorys.length) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Category not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      categories: categorys,
    });
});

/* get Category detail by params id */
const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  if (!category) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Category not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      category: category,
    });
});

/* update type place detail by params id*/
const updateCategorysById = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).json({
    status: 200,
    message: "OK",
    category: category,
  });
});

/* delete type place by params id */
const deleteCategoryById = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    status: 204,
    message: "Delete Ok",
  });
});
module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategorysById,
  deleteCategoryById,
};
