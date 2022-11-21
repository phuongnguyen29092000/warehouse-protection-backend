const express = require("express");

const { orderController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", orderController.getAllOrderByUser);

router.get(
  "/:id",
  orderController.getOrderById
);

router.post("/create", orderController.createOrder);

router.put("/:id", orderController.updatesStatusById);

router.delete("/:id", orderController.deleteOrderById);

module.exports = router;