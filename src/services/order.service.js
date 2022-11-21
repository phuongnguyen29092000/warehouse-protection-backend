const httpStatus = require('http-status');
const { Order, OrderDetail } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require("mongoose");

const createOrder = async(orderBody) => {
    const order = await Order.create(orderBody)
    return order
}

const createOrderDetails = async(details) => {
	return details.forEach(async(detail) => {
		const newRc = await OrderDetail.create(detail)
		return newRc
	})
}

const getAllOrderByUser = async(queriesData) => {
    return await Order.find()
}

const getCountAllOrderByUser = async(queriesData) => {
    return await Order.aggregate([
        {
            $lookup: {
              from: "users",
              localField: "buyer",
              foreignField: "_id",
              as: "buyer",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "seller",
              foreignField: "_id",
              as: "seller",
            },
          },
          { $unwind: "$buyer" },
          { $unwind: "$seller" },

          {
            $match: {
              subCategory: {
                $in: arrSubCate,
              },
              _id: { $regex: new RegExp(search, "i") },
            },
          },
    ]).skip(perPage * page - perPage)
    .limit(perPage);
}

const getOrderById = async(id) => {
	const orderDetailPerOrder = await OrderDetail.find({order: new mongoose.Types.ObjectId(id),})
  const orderDetail = await Order.findById(id)
	return {
		...orderDetail,
		details: orderDetailPerOrder
	}
}

const updateOrderById = async(id, status) => {
    const order = await getOrderById(id)
    Object.assign(order, {status: status});
    await order.save();
    return order;
}

const deleteOrderById = async(id) => {
    const order = await getOrderById(id)
    await order.remove()
    return Order
}

module.exports = {
    createOrder,
    getAllOrderByUser,
    getCountAllOrderByUser,
    getOrderById,
    updateOrderById,
    deleteOrderById,
		createOrderDetails
}