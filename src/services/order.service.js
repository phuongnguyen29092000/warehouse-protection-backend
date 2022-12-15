
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require("mongoose");
const { updateProductById, getProductById} = require('./product.service');
const { userService } = require('.');

const createOrder = async(orderBody) => {
  const order = await Order.create(orderBody)
  const details = order.details
  for (let i = 0; i < details?.length; i++) {
    const {amount} = await getProductById(details[i].product)
    await updateProductById(details[i].product, {amount: amount - details[i].quantity})
  }
  return order
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
  return await Order.findById(id)
}

const getOrderByAddress = async(address, actors) => {
  const {buyer, seller} = actors
  const buyerInfo = await userService?.getUserByWallet(buyer)
  const sellerInfo = await userService?.getUserByWallet(seller)
  const data = await Order.find({walletAddress : address}).populate('details.product')
  if(!data?.length) return null
  else {
    const details = []
    const productTemp = data[0]
    for (let index = 0; index < productTemp?.details.length; index++) {
      const element = productTemp?.details?.[index];
      details.push({...element?._doc, buyer: buyerInfo, seller: sellerInfo})
    }
    return {
      ...productTemp?._doc, details: details
    }
  }
}

const updateOrderRatedById = async(id) => {
    const order = await getOrderById(id)
    Object.assign(order, {isRated: true});
    await order.save();
    return order;
}

module.exports = {
    createOrder,
    getOrderById,
    updateOrderRatedById,
    getAllOrderByUser,
    getOrderByAddress
}