const express = require("express");

const { productController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();
const upLoadImage = require("../middlewares/imgUpload");

router.get("/", productController.getAllProduct);

router.get(
  "/:id",
  productController.getProductById
);

router.post("/create", upLoadImage.single('imageUrl'), productController.createProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
