const express = require("express");

const { categoryController } = require("../controllers");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", categoryController.getAllCategory);

router.get(
  "/:id",
  categoryController.getCategoryById
);

router.post("/create", categoryController.createCategory);

router.put("/:id", categoryController.updateCategorysById);

router.delete("/:id", categoryController.deleteCategoryById);

module.exports = router;
