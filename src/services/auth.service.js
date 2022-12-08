const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const tokenTypes = require("../config/tokens");

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  const admin = await userService.getAdminByEmail(email)
  if(user && (await user.isPasswordMatch(password))) {
    return user
  } 
  else if(admin && (await admin.isPasswordMatch(password))) {
    return admin
  } 
  else return null
};

const logout = async (accessToken, refreshToken) => {
  const accessTokenInfo = await Token.findOne({
    token: accessToken,
    type: tokenTypes.ACCESS,
  });
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await accessTokenInfo.remove();
  await refreshTokenDoc.remove();
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenInfo = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenInfo.user);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
    }
    // await refreshTokenInfo.remove();
    return tokenService.generateAccessRefreshToken(user._id.toString(), true);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

const changePass = async(email, password, isAdmin = false) => {
  let user
  if(isAdmin) {
    user = await userService.getAdminByEmail(email)
  } else {
    user = await userService.getUserByEmail(email)
  }
  Object.assign(user, { password })
  await user.save()
  return user
}

// const resetPassword = async (resetPasswordToken, newPassword) => {
//   try {
//     const resetPasswordTokenDoc = await tokenService.verifyToken(
//       resetPasswordToken,
//       tokenTypes.RESET_PASSWORD
//     );
//     const user = await userService.getUserById(resetPasswordTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await userService.updateUserById(user.id, { password: newPassword });
//     await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
//   }
// };

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  changePass
  // resetPassword,
};
