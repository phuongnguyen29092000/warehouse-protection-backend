const httpStatus = require('http-status')
const { userService, tokenService } = require('../services')
const tokenTypes = require('../config/tokens')
const { Token } = require('../models')

const auth = (...roles) => {
    return async(req, res, next) => {
        const token = req.headers['authorization'].split(' ')[1]
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: 401,
                message: "Token not found"
            })
        }
        const accessTokenInfo = await Token.findOne({ token: token, type: tokenTypes.ACCESS })
        if(!accessTokenInfo) return res.status(httpStatus.FORBIDDEN).json({
            status: 403,
            message: "FORBIDDEN"
        })
        try {
            req = req
            const payload = await tokenService.verifyToken(token, tokenTypes.ACCESS)
            req.userId = payload.user.toString()
            const user = await userService.getUserById(req.userId)
            const admin = await userService.getAdminById(req.userId)

            if (!user && !admin) return res.status(httpStatus.FORBIDDEN).json({
                status: 403,
                message: "Invalid Token"
            })
            
            const curentAccount = user || admin
            if (!roles.includes(curentAccount.role)) return res.status(httpStatus.UNAUTHORIZED).json({
                status: 401,
                message: "Unauthoried"
            })
            req.role = curentAccount.role
            req.userName = curentAccount.userName
            req.email = curentAccount.email
            req.accessToken = token
            req.body = req.body
            next()
        } catch {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 403,
                message: "FORBIDDEN"
            })
        }

    }
}

module.exports = auth