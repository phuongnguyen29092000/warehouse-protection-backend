const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const nodeMailer = require("nodemailer");
const { User } = require("../models");
const mongoose = require("mongoose");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    return null
  }
  if ((await getUserByCode(userBody.businessCode))?.length) {
    return null
  }
  const user = await User.create(userBody);
  return user;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByCode = async (code) => {
  return User.find({businessCode: code})
};

const getAllUser = async () => {
    return User.find()
  };

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  console.log(updateBody);
  const user = await getUserById(userId);
  if (!user)
    res.json({
      status: 404,
      message: "User not found",
    });
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    res.json({
      status: 400,
      message: "User not found",
    });
  }
  Object.assign(user, updateBody);
  console.log(user);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user)  res.json({
    status: 400,
    message: "User not found",
  });
  await user.remove();
  return user;
};

const setActiveUser = async (id) => {
  const user = await getUserById(id);
  const userUpdated = await User.findOneAndUpdate(
    { _id: id },
    { active: !user.active },
    { new: true }
  );
  return userUpdated;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  setActiveUser,
  getAllUser,
  getUserByCode
};
