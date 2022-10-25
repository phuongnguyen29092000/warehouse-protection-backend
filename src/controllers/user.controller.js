const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { userService } = require("../services");
const ApiError = require("../utils/ApiError");
const { emailBecomeOwner } = require("../config/emailTemplates");

/* create new user */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    status: 201,
    message: "Create user successfully",
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
  const user = await userService.updateUserById(req.params.id, req.body);

  res.status(httpStatus.OK).json({
    status: 200,
    message: "Update successfully!",
    user: user,
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

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  setActiveUser,
  getAllUser
};
