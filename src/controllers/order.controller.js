const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { orderService } = require("../services");

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create successfully",
    order: order,
  });
});

const getAllOrderByUser = catchAsync(async (req, res) => {
  const data = await orderService.getAllOrderByUser(req.params.id, req.query);
  if (!orders.count?.length) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Order not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      data: {
        orders: data.orderResult,
        count: data.count
      }
    });
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  if (!order) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Order not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      order: order,
    });
});

const getOrderByAddress = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByAddress(req.params.address, req.body);
  if (!Object.keys(order)?.length) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Order not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      order: order,
    });
});

module.exports = {
  createOrder,
  getAllOrderByUser,
  getOrderById,
  getOrderByAddress
};
