const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const userService = require('./user.service')
const { Token } = require('../models')
const tokenTypes = require('../config/tokens')

const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
    const payload = {
        id: userId,
        exp: expires.unix(),
        type,
    }
    return jwt.sign(payload, secret)
};

const saveToken = async(token, userId, expires, type) => {
    const tokenInfo = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
    })
    return tokenInfo
};

const verifyToken = async(token, type) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const tokenInfo = await Token.findOne({ token, type, user: payload.id })
    if (!tokenInfo) {
        throw new Error('Can not find token')
    }
    return tokenInfo
}

const generateAccessRefreshToken = async(id, isRefresh = false) => {
    const accessTokenExpires = moment().add(parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES), 'minutes')
    const accessToken = generateToken(id, accessTokenExpires, tokenTypes.ACCESS, process.env.JWT_SECRET)

    const refreshTokenExpires = moment().add(parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS), 'days')
    const refreshToken = generateToken(id, refreshTokenExpires, tokenTypes.REFRESH, process.env.JWT_SECRET)
    await saveToken(accessToken, id, accessTokenExpires, tokenTypes.ACCESS)
    if(!isRefresh) await saveToken(refreshToken, id, refreshTokenExpires, tokenTypes.REFRESH)
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    }
}

const generateResetPasswordToken = async(email) => {
    const company= await userService.getUserByEmail(email);
    const admin = await userService.getAdminByEmail(email);
    const user = admin || company
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(parseInt(process.env.RESET_PASSWORD_EXPIRATION_MINUTES), 'minutes');
    const resetPasswordToken = generateToken(user._id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user._id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
};

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAccessRefreshToken,
    generateResetPasswordToken
}