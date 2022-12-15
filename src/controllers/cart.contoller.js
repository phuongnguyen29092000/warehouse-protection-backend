const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { cartService } = require("../services");

const createOrUpdateCart = catchAsync(async (req, res) => {
  const cartItem = await cartService.getCartByUser(req.params.userId);
  const products = [{ ...req.body }];
  if (!cartItem) {
    await cartService.createCart(
      Object.assign({ products: products }, { user: req.params.userId })
    );
    const cartItem = await cartService.getCartByUser(req.params.userId);

    res.status(httpStatus.CREATED).json({
      status: 201,
      message: "Create successfully",
      cart: cartItem,
    });
  } else {
    await cartService.addItemCartById(req.params.userId, req.body);
    const cartItem = await cartService.getCartByUser(req.params.userId);
    res.status(httpStatus.CREATED).json({
      status: 200,
      message: "Update successfully",
      cart: cartItem,
    });
  }
});

const getCartByUserId = catchAsync(async (req, res) => {
  const Cart = await cartService.getCartByUser(req.params.userId);

  if (!Object.keys(Cart)?.length) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Cart not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      cart: Cart,
    });
});

const deleteItemCartById = catchAsync(async (req, res) => {
  await cartService.deleteItemCartById(req.params.userId, req.body.productId);
  const cartItem = await cartService.getCartByUser(req.params.userId);
  res.status(httpStatus.OK).json({
    status: 200,
    message: "Delete Ok",
    cart: cartItem,
  });
});

const deleteMultipleItemCartById = catchAsync(async (req, res) => {
  await cartService.deleteMultipleItemCartById(req.params.userId, req.body.ids);
  const cartItem = await cartService.getCartByUser(req.params.userId);
  res.status(httpStatus.OK).json({
    status: 200,
    message: "Delete Ok",
    cart: cartItem,
  });
});
module.exports = {
  createOrUpdateCart,
  getCartByUserId,
  deleteItemCartById,
  deleteMultipleItemCartById,
};
