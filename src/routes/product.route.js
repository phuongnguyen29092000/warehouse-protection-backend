const express = require("express");

const { productController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();
const upLoadImage = require("../middlewares/imgUpload");

router.get("/", productController.getAllProduct);
router.get("/company/:id", productController.getAllProductCompany);

router.get(
  "/:id",
  productController.getProductById
);

router.post("/create", auth('user'), upLoadImage.single('imageUrl'), productController.createProduct);

router.put("/:id", auth('user'), productController.updateProduct);

router.delete("/:id", auth('user'), productController.deleteProduct);

module.exports = router;
