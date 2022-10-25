const express = require("express");

const { productController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", productController.getAllProduct);

router.get(
  "/:id",
  productController.getProductById
);

router.post("/create", productController.createProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
