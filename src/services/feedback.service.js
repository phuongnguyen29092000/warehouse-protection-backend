//
const httpStatus = require('http-status');
const { Feedback } = require('../models');
const ApiError = require('../utils/ApiError');

const createFeedback = async(body) => {
    const res = await Feedback.create(body)
    return res
}

const getFeedbackBySellerId = async(id) => {
    return await Feedback.find({seller: id.toString()})
}

const getFeedbackById = async(id) => {
    return (await Feedback.find({order: id.toString()}))?.[0]
}

module.exports = {
    createFeedback,
    getFeedbackBySellerId,
    getFeedbackById
}