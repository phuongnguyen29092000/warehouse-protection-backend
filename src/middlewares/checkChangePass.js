const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const checkChangePass = catchAsync(async(req, res, next) => {
    const user = await userService.getUserByEmail(req.body.email)
    const admin = await userService.getAdminByEmail(req.body.email)
    const currentUser = user || admin

    if (!currentUser || !(await currentUser.isPasswordMatch(req.body.oldpass))) {
        res.status(httpStatus.UNAUTHORIZED)
            .json({
                status: 401,
                message: "Mật khẩu cũ không đúng. Vui lòng thử lại!"
            })
    }
    req = req
    next()
})

module.exports = checkChangePass