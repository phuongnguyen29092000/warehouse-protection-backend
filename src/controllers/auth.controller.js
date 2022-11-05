const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, authService, tokenService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAccessRefreshToken(user?._id.toString());
  res.status(200).json({
    status: 200,
    message: 'ok',
    user,
    tokens
  })
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.accessToken, req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(200).json({ 
    status: 200,
    message: 'logout success',
    tokens
  });
});

// const forgotPassword = catchAsync(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  login,
  logout,
  refreshTokens,
};
