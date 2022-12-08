const express = require("express");

const { categoryController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", categoryController.getAllCategory);

router.get(
  "/:id",
  categoryController.getCategoryById
);

router.post("/create", auth('admin'), categoryController.createCategory);

router.put("/:id", auth('admin'),categoryController.updateCategorysById);

router.delete("/:id", auth('admin'), categoryController.deleteCategoryById);

module.exports = router;
