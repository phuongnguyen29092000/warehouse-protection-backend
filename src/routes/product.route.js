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

router.post("/create-multiple", auth('user'), productController.createProductWhenPayment);

router.post("/create-multiple", productController.createProductWhenPayment);

router.post("/return-product-seller", productController.returnProductToSeller);

router.put("/:id", auth('user'), upLoadImage.single('imageUrl'),  productController.updateProduct);

router.delete("/:id", auth('user'), productController.deleteProduct);

module.exports = router;
