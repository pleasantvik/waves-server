const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const httpStatus = require("http-status");

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

// const User = require("../models/userModel");
// const APIFeatures = require('../utils/apiFeatures');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const Factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     //Give the photo a unique name. user-id-timestamp-extension
//     const extension = file.mimetype.split('/')[1]; // jpeg,png etc
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   }
// });

// exports.getUser = Factory.getOne(User);
// exports.getAllUsers = Factory.getAll(User);

// // Update user who is login
// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user.id, {
//     active: false,
//   });

//   res.status(200).json({
//     status: "success",
//     data: null,
//   });
// });

// // Update user who is login
// exports.updateMe = catchAsync(async (req, res, next) => {
//   //Uploading images
//   // console.log(req.file);
//   // console.log(req.body);
//   //1. Create error if user tries updating password from this route
//   if (req.body.password || req.body.confirmPassword)
//     return next(
//       new AppError(
//         "This route is not for password update, please use /updateMyPassword",
//         400
//       )
//     );

//   //2. Filter out unwanted field
//   const filteredBody = filterObj(req.body, "name", "email");
//   if (req.file) filteredBody.photo = req.file.filename;
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

// exports.deleteUser = Factory.deleteOne(User);
// exports.updateUser = Factory.updateOne(User);
// exports.getUser = Factory.getOne(User);
// exports.getAllUsers = Factory.getAll(User);
