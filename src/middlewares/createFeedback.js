const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createFeedback = catchAsync(async(req, res, next) => {
    const order = await orderService.getOrderById(req.params.id)

    if (order?.isRated) {
        res.status(httpStatus.UNAUTHORIZED)
            .json({
                status: 401,
                message: "Đơn hàng đã được đánh giá!"
            })
    }
    req = req
    next()
})

module.exports = createFeedback