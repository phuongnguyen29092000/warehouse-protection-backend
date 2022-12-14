const express = require("express");

const { orderController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/company/:id", auth('user'), orderController.getAllOrderByUser);

router.get(
  "/:id", auth('user'),
  orderController.getOrderById
);

router.post(
  "/wallet/:address",
  orderController.getOrderByAddress
);

router.post("/create", auth('user'), orderController.createOrder);

module.exports = router;