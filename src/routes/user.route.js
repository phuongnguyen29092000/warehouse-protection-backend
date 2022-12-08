const express = require("express");

const { userController } = require("../controllers");
const auth = require('../middlewares/auth');
const upLoadImage = require("../middlewares/imgUpload");

const router = express.Router();

router.get("/", userController.getAllUser);
router.get("/search", userController.getUserBySearchKey);

router.post("/create", upLoadImage.single('photoUrl'), userController.createUser);

router.get("/:id", userController.getUserById);

router.get("/wallet/:id", userController.getUserByWallet);

router.put("/:id", auth('user'), upLoadImage.single('photoUrl'), userController.updateUserById);

router.put("/set_active/:userId", auth('admin'),  userController.setActiveUser);

router.delete("/:id",auth('admin'), userController.deleteUserById);

module.exports = router;
