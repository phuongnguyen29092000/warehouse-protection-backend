const httpStatus = require("http-status");
const { Cart } = require("../models");
const userService = require('./user.service')
const ApiError = require("../utils/ApiError");

const createCart = async (CartBody) => {
  const cart = await Cart.create(CartBody)
  return cart;
};

const getCartByUser = async (user) => {
  const data = await Cart.find({user}).populate('products.product');
  if(!data?.length) return null
  else {
    const products = []
    const productTemp = data[0]
    for (let index = 0; index < productTemp?.products.length; index++) {
      const element = productTemp?.products?.[index];
      const userInfo = await userService?.getUserById(element?.product?.user.toString())
      products.push({...element?._doc, userInfo})
    }
    return {
      ...productTemp?._doc, products: products
    }
  }
};

const addItemCartById = async (userId, catBody) => {
  const products = (await getCartByUser(userId))?.products;
  products.push(catBody)
  const cartUpdated = await Cart.findOneAndUpdate(
    {user: userId},
    {products: products},
    { new: true }
  )
  return cartUpdated;
};

const deleteItemCartById = async (userId, idProduct) => {
  const products = (await getCartByUser(userId))?.products;
  const newProduct = products?.filter((p)=> {
    return p?.product._id.toString() !== idProduct.toString()
  })
  const cartUpdated = await Cart.findOneAndUpdate(
    {user: userId},
    {products: newProduct},
    { new: true }
  )
  return cartUpdated;
};

const deleteMultipleItemCartById = async (userId, ids) => {
  const products = (await getCartByUser(userId))?.products;
  const newProduct = products?.filter((p)=> {
    return !ids.includes(p?.product._id.toString())
  })
  const cartUpdated = await Cart.findOneAndUpdate(
    {user: userId},
    {products: newProduct},
    { new: true }
  )
  return cartUpdated;
};

module.exports = {
  createCart,
  getCartByUser,
  addItemCartById,
  deleteItemCartById,
  deleteMultipleItemCartById
};
