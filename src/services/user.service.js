const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const nodeMailer = require("nodemailer");
const { User, Admin } = require("../models");
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

const createAdmin = async (userBody) => {
  if (await Admin.isEmailTaken(userBody.email)) {
    return null
  }
  const admin = await Admin.create(userBody);
  return admin;
};

const getAdminByEmail = async (email) => {
  return Admin.findOne({ email });
};

const getAdminById = async (id) => {
  return Admin.findById(id);
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByWallet = async (address) => {
  return User.findById({address});
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

const searchByCompanyName = async(searchKey) => {
  searchKey = searchKey.trim()
  return await User.find({
    companyName: { $regex: searchKey, $options: "i" }
  })
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  setActiveUser,
  getAllUser,
  getUserByCode,
  getUserByWallet,
  createAdmin,
  getAdminByEmail,
  getAdminById,
  searchByCompanyName
};
