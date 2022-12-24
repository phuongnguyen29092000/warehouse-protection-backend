const express = require('express')

const { authController } = require('../controllers')
const auth = require('../middlewares/auth')
const checkChangePass = require('../middlewares/checkChangePass')

const router = express.Router()

router.post("/login", authController.login)
router.post("/logout", auth('admin', 'user'), authController.logout)
router.post('/refresh-tokens', authController.refreshTokens);
router.post('/changepass', auth('admin', 'user'), checkChangePass, authController.changePass)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router 