const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { userService, tokenService } = require("../services");
const ApiError = require("../utils/ApiError");

/* create new user */
const createUser = catchAsync(async (req, res) => {
  const image = req.file ? { photoUrl: req.file.path } : {}
  const createBody = Object.assign(req.body, image);
  const user = await userService.createUser(createBody);
  const tokenAuth = await tokenService.generateAccessRefreshToken(user?._id.toString());

  if(!user) res.status(400).json({
    status: 400,
    message: "Error",
  })
  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create user successfully",
    user,
    tokenAuth
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const image = req?.file ? { photoUrl: req.file.path } : {}
  const createBody = Object.assign(req.body, image);
  const admin = await userService.createAdmin(createBody);
  const tokenAuth = await tokenService.generateAccessRefreshToken(admin?._id.toString());

  if(!admin) res.status(400).json({
    status: 400,
    message: "Error",
  })
  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create admin successfully",
    admin,
    tokenAuth
  });
});

/* get user detail by id */
const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user)
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Not found",
    });
  else
    res.status(200).json({
      status: 200,
      message: "OK",
      user: user,
    });
});

const getUserByWallet = catchAsync(async (req, res) => {
  const user = await userService.getUserByWallet(req.params.address);

  if (!user)
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Not found",
    });
  else
    res.status(200).json({
      status: 200,
      message: "OK",
      user: user,
    });
});

const getAllUser = catchAsync(async (req, res) => {
    const users = await userService.getAllUser()
    if (!users.length)
      res.status(httpStatus.NOT_FOUND).json({
        status: 404,
        message: "Users Not found",
      });
    else
      res.status(200).json({
        status: 200,
        message: "OK",
        users: users,
      });
  });

/* update user detail by id */
const updateUserById = catchAsync(async (req, res) => {
  const image = req.file ? { photoUrl: req.file.path } : {}
  const x = JSON.parse(req.body.address1)
  const newUser = await userService.updateUserById(req.params.id, Object.assign(Object.assign(req.body, {address: x}), image));

  res.status(httpStatus.OK).json({
    status: 200,
    message: "Update successfully!",
    user: newUser,
  });
});

const updateAdminById = catchAsync(async (req, res) => {
  const image = req.file ? { photoUrl: req.file.path } : {}
  const user = await userService.updateAdminById(req.params.id, Object.assign(req.body, image));

  res.status(httpStatus.OK).json({
    status: 200,
    message: "Update successfully!",
    user,
  });
});

/* delete user detail by id */
const deleteUserById = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    status: 204,
    message: "Delete successfully",
  });
});

const setActiveUser = catchAsync(async(req,res) =>{
  const user = await userService.setActiveUser(req.params.userId)
  if (!user)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 500,
      message: "Failed",
    });
  else
    res.status(200).json({
      status: 200,
      message: "OK",
      user: user,
    });
})

const getUserBySearchKey = catchAsync(async (req, res) => {
  const users = await userService.searchByCompanyName(req.query.key)
  if (!users.length)
    res.status(httpStatus.NOT_FOUND).json({
      status: 404,
      message: "Users Not found",
    });
  else
    res.status(200).json({
      status: 200,
      message: "OK",
      users: users,
    });
});

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  setActiveUser,
  getAllUser,
  getUserByWallet,
  createAdmin,
  getUserBySearchKey,
  updateAdminById
};
