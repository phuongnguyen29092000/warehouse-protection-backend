const express = require("express");

const { cartController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/:userId", auth('user'),
  cartController.createOrUpdateCart
);

router.put("/change-count/:userId", auth('user'), cartController.updateCountItem);

router.get("/:userId", auth('user'), cartController.getCartByUserId);

router.put("/:userId", auth('user'), cartController.deleteItemCartById);


router.put("/multiple/:userId", auth('user'), cartController.deleteMultipleItemCartById);

module.exports = router;
