const express = require("express");

const { subCategoryController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", subCategoryController.getAllSubCategory);
router.get("/category/:id", subCategoryController.getSubCategoryByCategoryId);

router.get(
  "/:id",
  subCategoryController.getSubCategoryById
);

router.post("/create", subCategoryController.createSubCategory);

router.put("/:id", subCategoryController.updateSubCategorysById);

router.delete("/:id", subCategoryController.deleteSubCategoryById);

module.exports = router;
