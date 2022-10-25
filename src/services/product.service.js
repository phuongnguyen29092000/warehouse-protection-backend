const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

const createProduct = async(productBody) => {
    const product = await Product.create(productBody)
    return product
}

const getAllProduct = async() => {
    return await Product.find()
}

const getProductById = async(id) => {
    return await Product.findById(id)
}

const updateProductById = async(id, productBody) => {
    const product = await getProductById(id)
    Object.assign(product, productBody);
    await product.save();
    return product;
}

const deleteProductById = async(id) => {
    const product = await getProductById(id)
    await product.remove()
    return product
}

module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProductById,
    deleteProductById,
}