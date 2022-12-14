const catchAsync = require("../utils/catchAsync");
const { productService, orderService } = require("../services");
const { Product, Order} = require('../models')
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getAllProduct = catchAsync(async (req, res, next) => {
  const prds = await productService.getAllProduct(req.query);
  const count = (await productService.getTotalCountAllProduct(req.query))?.length
  if (!prds.length) {
    res.json({
      status: 404,
      message: "Not found",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "OK",
      data: {
        products: prds,
        count: count
      }
    });
  }
});

const getAllProductCompany = catchAsync(async (req, res, next) => {
  const {products, totalCount} = await productService.getProductByCompany(req.params.id, req.query)
  if (!totalCount) {
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "OK",
      data: {
        products: products,
        count: totalCount
      }
    });
  }
});

const createProduct = catchAsync(async (req, res, next) => {
  const image = req.file ? { imageUrl: req.file.path } : {}
  const createBody = Object.assign(req.body, image);
  const product = await productService.createProduct(createBody);
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

const createProductWhenPayment = catchAsync(async(req, res, next) => {
  const {buyerId, orderAddress} = req.body
  const orderDetail = (await Order.find({walletAddress: orderAddress}))?.[0]
  for (let i = 0; i < orderDetail?.details?.length; i++) {
    const item =  orderDetail?.details?.[i];
    const productDetail = await Product.findById(item?.product.toString())
    const newProduct = {
      productName: productDetail?.productName,
      description: productDetail?.description,
      imageUrl: productDetail?.imageUrl,
      price: item?.priceDis,
      warrantyPeriod: productDetail?.warrantyPeriod,   
      amount: item?.quantity,
      minimumQuantity: item?.quantity,
      discount: 0,
      isSelling: false,
      subCategory: productDetail?.subCategory,
      user: buyerId,
      manufacturer: productDetail?.manufacturer, 
      dateOfManufacture: productDetail?.dateOfManufacture
    }
    await productService.createProduct(newProduct)
  }

  res.status(200).json({
    status: 200,
    message: 'ok',
  });
})

const returnProductToSeller = catchAsync(async (req, res, next) => {
  const {orderAddress} = req.body
  const orderDetail = (await Order.find({walletAddress: orderAddress}))?.[0]
  const countUpdated = await productService.returnProductToSeller(orderDetail)
  if(countUpdated === orderDetail?.details?.length)
  res.status(200).json({
    status: 200,
    message: "oke",
  })
  else res.status(400).json({
    status: 400,
    message: "error",
  })
});

const deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProductById(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    status: 204,
    message: "Delete successfully",
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const productDetail = await productService.getProductById(req.params.id);
  const image = req.file ? { imageUrl: req.file.path } : { imageUrl: productDetail.imageUrl}
  const updateBody = Object.assign(req.body, image);
  const product = await productService.updateProductById(req.params.id, updateBody);
  if (!product) res.status(400).json({
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
  getProductById,
  getAllProductCompany,
  createProductWhenPayment,
  returnProductToSeller
};
