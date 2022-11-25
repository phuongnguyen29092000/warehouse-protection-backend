const httpStatus = require('http-status');
const { Order, OrderDetail } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require("mongoose");

const createOrder = async(orderBody) => {
    const order = await Order.create(orderBody)
    return order
}

const createOrderDetails = async(orderId, details) => {
  const newD = []
  for (let index = 0; index < details.length; index++) {
    const newRc = await OrderDetail.create({...details[index], order: orderId})
    newD.push(newRc)
  }
	return newD
}

const getAllOrderByUser = async(id,queriesData) => {
  const page = parseInt(queriesData?.skip) || 1;
  const perPage = parseInt(queriesData?.limit) || 12;
  const searchKey = queriesData?.s || "";
  const typeQuery = queriesData?.type || ""

  if(typeQuery === 'sales') {
    const orderResult = await Order.aggregate([
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
              buyer: new mongoose.Types.ObjectId(id),
              _id: { $regex: new RegExp(searchKey, "i") },
            },
          },
    ]).skip(perPage * page - perPage)
    .limit(perPage);

    const count = await Order.aggregate([
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
            buyer: new mongoose.Types.ObjectId(id),
            _id: { $regex: new RegExp(searchKey, "i") },
          },
        },
      ])
    return {
      orderResult,
      count: count?.length
    }
  }

  if(typeQuery === 'purchase') {
    const orderResult = await Order.aggregate([
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
            seller: new mongoose.Types.ObjectId(id),
            _id: { $regex: new RegExp(searchKey, "i") },
          },
        },
    ])
    const count = await Order.aggregate([
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
            seller: new mongoose.Types.ObjectId(id),
            _id: { $regex: new RegExp(searchKey, "i") },
          },
        },
      ])
    return {
      orderResult,
      count: count?.length
    }
  }

  if(!typeQuery) {
    const orderResult = (await Order.aggregate([
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
            _id: { $regex: new RegExp(searchKey, "i") },
          },
        },
      ]).skip(perPage * page - perPage)
      .limit(perPage))?.filter((order)=> {
      return order.seller.toString() === id || order.buyer.toString() === id
    })
    const count = (await Order.aggregate([
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
            _id: { $regex: new RegExp(searchKey, "i") },
          },
        },
      ]))?.filter((order)=> {
      return order.seller.toString() === id || order.buyer.toString() === id
    })
    
    return {
      orderResult,
      count: count?.length
    }
  }
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
    getOrderById,
    updateOrderById,
    deleteOrderById,
		createOrderDetails,
    getAllOrderByUser
}