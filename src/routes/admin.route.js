const express = require("express");

const { userController } = require("../controllers");
const auth = require('../middlewares/auth');
const upLoadImage = require("../middlewares/imgUpload");

const router = express.Router();

router.post("/create", upLoadImage.single('imageUrl'), userController.createAdmin);

router.get("/:id",userController.getUserById);

router.put("/:id", userController.updateUserById);


module.exports = router;
