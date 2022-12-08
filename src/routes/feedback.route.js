const express = require("express");

const { feedbachController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/create/:id", auth('user'), feedbachController.createFeedback);

router.get(
  "/company/:id",
  feedbachController.getFeedbackSellerId
);

module.exports = router;