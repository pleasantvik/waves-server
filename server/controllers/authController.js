// const crypto = require("crypto");
// const { promisify } = require("util");
const jwt = require("jsonwebtoken");
// // const User = require("../models/userModel");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const httpStatus = require("http-status");
// // const Email = require("../utils/email");

// // const signToken = (id) => {
// //   return jwt.sign({ id }, process.env.JWT_SECRET, {
// //     expiresIn: process.env.JWT_EXPIRES_IN,
// //   });
// // };

// // const createSendToken = (user, statusCode, res) => {
// //   const token = signToken(user._id);
// //   const cookieOptions = {
// //     expires: new Date(
// //       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
// //     ),

// //     httpOnly: true,
// //   };
// //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
// //   res.cookie("jwt", token, cookieOptions);

// //   //Remove Password from output
// //   user.password = undefined;

// //   res.status(statusCode).json({
// //     status: "success",
// //     token,
// //     data: {
// //       user,
// //     },
// //   });
// // };

// exports.signup = catchAsync(async (req, res, next) => {
//   const { name, email, password, confirmPassword, passwordChangedAt, role } =
//     req.body;
//   const newUser = await User.create({
//     name,
//     email,
//     password,
//     confirmPassword,
//     passwordChangedAt,
//     role,
//   });

exports.signin = catchAsync(async (req, res, next) => {
  res.status(httpStatus.CREATED).json({
    status: "success",
    message: "welcome signin",
  });
});

exports.isauth = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "welcome auth",
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { firstname, email, password, lastname, confirmPassword } = req.body;

  const newUser = await User.create({
    firstname,
    email,
    password,
    confirmPassword,
    lastname,
  });

  //CREATING TOKEN
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  res.status(httpStatus.CREATED).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });

  // next(new AppError("Something went wrong", 500));
});

//   //EXPORTED INTO A FUNCCTION
//   //   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//   //     expiresIn: process.env.JWT_EXPIRES_IN
//   //   });
//   // const token = signToken(newUser._id);

//   // res.status(201).json({
//   //   status: 'success',
//   //   token,
//   //   data: {
//   //     user: newUser
//   //   }
//   // });
//   const url = `${req.protocol}://${req.get("host")}/me`;
// //   await new Email(newUser, url).sendWelcome();
// //   createSendToken(newUser, 201, res);
// });

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   //1. Check if email and password exist
//   if (!email || !password) {
//     return next(new AppError("Please provide email and password", 400));
//   }

//   //2. Check if user exist and password is correct
//   const user = await User.findOne({ email }).select("+password");
//   //   const checkCorrectPassword = await user.correctPassword(password, user.password);

//   //   console.log(user);
//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError("Incorrect email or password", 401));
//   }

//   //3. send jwt token if everything exist
//   // const token = signToken(user._id);

//   // res.status(200).json({
//   //   status: 'success',
//   //   token
//   // });

//   createSendToken(user, 200, res);
// });

// exports.logout = (req, res, next) => {
//   res.cookie("jwt", "logged out", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });
//   res.status(200).json({ status: "success" });
// };

// exports.protect = catchAsync(async (req, res, next) => {
//   let token;
//   //1. Get the token and check if it exists or Get the token from cookies
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }

//   if (!token)
//     return next(
//       new AppError("You are not logged in! Please logged in to get access", 401)
//     );

//   //2. Verify the token validity
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   console.log(decoded);
//   //3. Check if user still exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser)
//     return next(new AppError("the user with the token no longer exist", 401));
//   //4. Check if user changed password after the token was issue
//   if (currentUser.changedPasswordAfter(decoded.iat))
//     return next(
//       new AppError("User recently changed password! Please login again", 401)
//     );
//   //GRANT ACCESS TO PROTECTED ROUTE
//   req.user = currentUser;
//   res.locals.user = currentUser;

//   next();
// });

// // ONLY FOR RENDER PAGES
// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );
//       //3. Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) return next();
//       //4. Check if user changed password after the token was issue
//       if (currentUser.changedPasswordAfter(decoded.iat)) return next();

//       //THERE IS A LOGIN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };

// // AUTHORIZATION
// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     // roles is ['admin', 'lead-guide']
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError("You do not have permission to perform thos action", 403)
//       );
//     }
//     next();
//   };
// };

// // RESET PASSWORD
// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   //1. Get user based on posted email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user)
//     return next(new AppError("There is no user with the email address"), 404);
//   //2. Generate random token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
//   //3. send to user email
//   const resetURL = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/users/resetPassword/${resetToken}`;

//   // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm: ${resetURL}.\nIf you didtn forget your password please ignore the email`;

//   try {
//     // await sendEmail({
//     //   email: user.email,
//     //   subject: 'Your password reset token (valid for 10 mins)',
//     //   message
//     // });
//     await new Email(user, resetURL).sendPasswordReset();
//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;

//     await user.save({ validateBeforeSave: false });
//     return next(new AppError("There was an error try later", 500));
//   }
// });
// exports.resetPassword = catchAsync(async (req, res, next) => {
//   //1. GET USER BASE ON TOKEN
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
//   //2. If token has nit expired and user exist, set new password
//   if (!user) return next(new AppError("Token is invalid or has expired", 400));
//   user.password = req.body.password;
//   user.confirmPassword = req.body.confirmPassword;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   //3. update  changePasswordAt property for the user
//   //4. Log user in send JWT
//   //3. send jwt token if everything exist
//   // const token = signToken(user._id);

//   // res.status(200).json({
//   //   status: 'success',
//   //   token
//   // });
//   createSendToken(user, 201, res);
// });

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   //1. Get user from collection
//   const user = await User.findById(req.user.id).select("+password");

//   //2. Check if posted current password by user is same with password in DB
//   if (!(await user.correctPassword(req.body.currentPassword, user.password)))
//     return next(new AppError("Incorrect Password", 401));

//   //3. if 2 check out update the Passowrd
//   user.password = req.body.password;
//   user.confirmPassword = req.body.confirmPassword;

//   await user.save();
//   // const token = signToken(user._id);
//   // res.status(200).json({
//   //   status: 'success',
//   //   token
//   // });
//   createSendToken(user, 201, res);

//   //4. Log user in
// });

// exports.signup = catchAsync(async (req, res, next) => {
//     const {
//       name,
//       email,
//       password,
//       confirmPassword,
//       passwordChangedAt,
//       role
//     } = req.body;
//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       confirmPassword,
//       passwordChangedAt,
//       role
//     });

//     //EXPORTED INTO A FUNCCTION
//     //   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//     //     expiresIn: process.env.JWT_EXPIRES_IN
//     //   });
//     // const token = signToken(newUser._id);

//     // res.status(201).json({
//     //   status: 'success',
//     //   token,
//     //   data: {
//     //     user: newUser
//     //   }
//     // });
//     const url = `${req.protocol}://${req.get('host')}/me`;
//     await new Email(newUser, url).sendWelcome();
//     createSendToken(newUser, 201, res);
//   });
