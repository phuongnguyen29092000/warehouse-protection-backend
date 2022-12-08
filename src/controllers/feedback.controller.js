//
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { feedbackService, orderService } = require("../services");

const createFeedback = catchAsync(async (req, res) => {
	await orderService.updateOrderRatedById(req.params.id)
  const feedback = await feedbackService.createFeedback(req.body);
  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create successfully",
    feedback: feedback,
  });
});

const getFeedbackSellerId = catchAsync(async (req, res) => {
  const feedbacks = await feedbackService.getFeedbackBySellerId(req.params.id);

  if (!feedbacks.length) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Feedback not found",
    });
  } else
    res.status(httpStatus.OK).json({
      status: 200,
      message: "OK",
      feedbacks: feedbacks,
    });
});

module.exports = {
  createFeedback,
  getFeedbackSellerId,
};