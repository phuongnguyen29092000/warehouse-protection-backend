const express = require('express')

const { authController } = require('../controllers')

const router = express.Router()

router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.post('/refresh-tokens', authController.refreshTokens);

module.exports = router 