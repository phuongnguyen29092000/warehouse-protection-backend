const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, authService, tokenService } = require('../services');
const { emailResetPassword } = require("../config/emailTemplates");

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if(!user) res.status(401).json({
    status: 401,
    message: 'error',
  })
  else {
    const tokenAuth = await tokenService.generateAccessRefreshToken(user?._id.toString());
    res.status(200).json({
      status: 200,
      message: 'ok',
      user,
      tokenAuth
    })
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.accessToken, req.body.refreshToken);
  res.status(httpStatus.OK).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(200).json({ 
    status: 200,
    message: 'refresh success',
    tokens
  });
});

const changePass = catchAsync(async(req, res) => {
  const { oldpass, newpass, confirmpass, email } = req.body
  const isAdmin = !!(await userService.getAdminByEmail(email))
  const user = await authService.changePass(email, newpass, isAdmin)
  if (!user) res.status(httpStatus.BAD_REQUEST).json({
    status: 400,
    message: "Lỗi Server. Vui lòng thử lại!"
  })
  res.status(200).json({
    status: 200,
    message: "Đổi mật khẩu thành công!"
  })
})

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailResetPassword(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send();
});

const resetPassword = catchAsync(async (req, res) => {
  const {password, confirmPassword} = req.body

  if(!password || !confirmPassword) res.status(400).json({
    status: 400,
    message: 'Please type all fields'
  })
  if(password !== confirmPassword) res.status(400).json({
    status: 400,
    message: 'Confirm password not match'
  })
  await authService.resetPassword(req.query.token, password);
  res.status(httpStatus.OK).send();
});

module.exports = {
  login,
  logout,
  refreshTokens,
  changePass,
  forgotPassword,
  resetPassword
};
