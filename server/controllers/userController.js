const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const httpStatus = require("http-status");

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(httpStatus.OK).json({
    status: "success",
    results: users.length,
    data: users,
  });
});
exports.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  res.status(200).json({
    status: "success",
    data: user,
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",

    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

//UPDATE SIGNED IN USER
exports.updateMe = catchAsync(async (req, res, next) => {
  //1. Post error if user try to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for updating password",
        httpStatus.BAD_REQUEST
      )
    );
  }

  // Filter out the field that user should not be able to upload
  const filteredBody = filteredObj(req.body, "firstname", "lastname", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(httpStatus.OK).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
