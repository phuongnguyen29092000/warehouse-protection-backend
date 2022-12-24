const express = require("express");

const { feedbachController } = require("../controllers");

const auth = require("../middlewares/auth");
const createFeedback = require('../middlewares/createFeedback')

const router = express.Router();

router.post("/create/:id", auth('user'), createFeedback, feedbachController.createFeedback);

router.get(
  "/company/:id",
  feedbachController.getFeedbackSellerId
);

router.get(
  "/:id",
  feedbachController.getFeedbackId
);

module.exports = router;