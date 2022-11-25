const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { orderService } = require("../services");


const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body.order);
	const details = await orderService.createOrderDetails(order._id.toString(),req.body.details);

  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create successfully",
    order: order,
		details: details,
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

const updatesStatusById = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(
    req.params.id,
    req.body.status
  );
  res.status(httpStatus.OK).json({
    status: 200,
    message: "OK",
    order: order,
  });
});

const deleteOrderById = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    status: 204,
    message: "Delete Ok",
  });
});
module.exports = {
  createOrder,
  getAllOrderByUser,
  getOrderById,
  updatesStatusById,
  deleteOrderById,
};
