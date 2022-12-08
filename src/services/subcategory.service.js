const httpStatus = require('http-status');
const { SubCategory, Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createSubCategory = async(cubcategoryBody) => {
    const cubcategory = await SubCategory.create(cubcategoryBody)
    return cubcategory
}

const getAllSubCategory = async() => {
    return await SubCategory.find().populate('category')
}
const getSubCategoryByCategoryId = async(id) => {
    return await SubCategory.find({category: id.toString()})
}

const getSubCategoryById = async(id) => {
    return await SubCategory.findById(id)
}

const updateSubCategoryById = async(id, subcatBody) => {
    const subcategory = await getSubCategoryById(id)
    Object.assign(subcategory, subcatBody);
    await subcategory.save();
    return subcategory;
}

const deleteSubCategoryById = async(id) => {
    const subcategory = await getSubCategoryById(id)
    await subcategory.remove()
    return subcategory
}

module.exports = {
    createSubCategory,
    getAllSubCategory,
    getSubCategoryById,
    updateSubCategoryById,
    deleteSubCategoryById,
    getSubCategoryByCategoryId
}