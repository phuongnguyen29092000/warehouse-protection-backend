const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");
const ApiError = require("../utils/ApiError");

const getAllProduct = catchAsync(async (req, res, next) => {
  const prds = await productService.getAllProduct(req.query);
  if (!prds.length) {
    req.json({
      status: 404,
      message: "Not found",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "OK",
      product: prds,
    });
  }
});

const createProduct = catchAsync(async (req, res, next) => {
  if (
    !req.files.imageSlide0 ||
    !req.files.imageSlide1 ||
    !req.files.imageSlide2 ||
    !req.files.imageSlide3
  ) {
    return next(new ApiError("Please upload image!", 400));
  }
  const imageSlide0 = req.files.imageSlide0[0].path;
  const imageSlide1 = req.files.imageSlide1[0].path;
  const imageSlide2 = req.files.imageSlide2[0].path;
  const imageSlide3 = req.files.imageSlide3[0].path;
  const imageSlidesPath = [];
  imageSlidesPath.push(imageSlide0);
  imageSlidesPath.push(imageSlide1);
  imageSlidesPath.push(imageSlide2);
  imageSlidesPath.push(imageSlide3);
  const createBody = Object.assign(req.body, { imageSlide: imageSlidesPath });
  const product = await productService.createTour(createBody);
  if (!product)
    req.status(400).json({
      stautus: 400,
      message: "Error create",
    });
  else {
    res.status(201).json({
      status: 201,
      product: product,
    });
  }
});

const deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProductById(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    status: 204,
    message: "Delete successfully",
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const productDetail = await productService.getProductById(req.params.id);
  let imageSlide0,
    imageSlide1,
    imageSlide2,
    imageSlide3,
    imageSlidesPath = [];
  if (req.files) {
    imageSlide0 = req.files.imageSlide0
      ? req.files.imageSlide0[0].path
      : productDetail.imageSlide[0];
    imageSlide1 = req.files.imageSlide1
      ? req.files.imageSlide1[0].path
      : productDetail.imageSlide[0];
    imageSlide2 = req.files.imageSlide2
      ? req.files.imageSlide2[0].path
      : productDetail.imageSlide[1];
    imageSlide3 = req.files.imageSlide3
      ? req.files.imageSlide3[0].path
      : productDetail.imageSlide[2];
    imageSlidesPath.push(imageSlide0);
    imageSlidesPath.push(imageSlide1);
    imageSlidesPath.push(imageSlide2);
    imageSlidesPath.push(imageSlide3);
  } else {
    imageSlide0 = productDetail.imageSlide[0];
    imageSlide1 = productDetail.imageSlide[0];
    imageSlide2 = productDetail.imageSlide[1];
    imageSlide3 = productDetail.imageSlide[2];
    imageSlidesPath.push(imageSlide0);
    imageSlidesPath.push(imageSlide1);
    imageSlidesPath.push(imageSlide2);
    imageSlidesPath.push(imageSlide3);
  }
  const updateBody = Object.assign(req.body, { imageSlide: imageSlidesPath });
  delete updateBody["imageSlide0"];
  delete updateBody["imageSlide1"];
  delete updateBody["imageSlide2"];
  delete updateBody["imageSlide3"];

  const tour = await productService.updateProductById(req.params.id, updateBody);
  if (!tour) res.status(400).json({
    status: 400,
    message: 'Error update'
  })
   else {
    res.status(200).json({
      status: 200,
      message: 'ok',
      product: product,
    });
  }
});

const getProductById = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
  
    if (!product) {
      res.status(httpStatus.NOT_FOUND).json({
        status: 404,
        message: "Product not found",
      });
    } else
      res.status(httpStatus.OK).json({
        status: 200,
        message: "OK",
        product: product,
      });
  });

module.exports = {
  getAllProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById
};
