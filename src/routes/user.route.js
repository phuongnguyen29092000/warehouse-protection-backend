const express = require("express");

const { userController } = require("../controllers");
const auth = require('../middlewares/auth')

const router = express.Router();

router.get("/", userController.getAllUser);

router.post("/create", userController.createUser);

router.get("/:id",userController.getUserById);

router.put("/:id", userController.updateUserById);

router.put("/set_active/:userId", userController.setActiveUser);

router.delete("/:id", userController.deleteUserById);

module.exports = router;
