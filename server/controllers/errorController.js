const AppError = require("../utils/appError");
const httpStatus = require("http-status");

//CAST ERROR
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};
// const handleJwtInvalidTokenError = () => {
//   const message = `Invalid token. Please log in again`;
//   return new AppError(message, 401);
// };
// const handleJwtExpiredTokenError = () => {
//   const message = `Your token has expired. Please log in again`;
//   return new AppError(message, 401);
// };

// //DUPLICATE FIELD
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value} ! Please use another value `;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

//VALIDATION ERROR
const handleValidationErrorDB = (err) => {
  const validatedError = Object.values(err.errors)
    .map((el) => el.message)
    .join(`. `);
  const message = `Invalid input data ${validatedError}`;
  return new AppError(message, 400);
};
//DEV ERROR
// const sendErrorDev = (err, req, res) => {
//   // API
//   if (req.originalUrl.startsWith("/api")) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       stack: err.stack,
//       error: err,
//       statusCode: err.statusCode,
//     });
//   } else {
//     //RENDERED WEBSITE
//     res.status(err.statusCode).render("error", {
//       title: "Something went wrong",
//       msg: err.message,
//     });
//   }
// };

//PROD ERROR
// const sendErrorProd = (err, req, res) => {
//   if (req.originalUrl.startsWith("/api")) {
//     //OPerational Error, send error to client
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//       // Progrmamming error: Unknown error, dont send to client, send sth generic
//     }
//     //1. Log  the error
//     console.error("Error ", err);
//     //2. Send generic msg to client
//     return res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//     });
//   }
//   if (err.isOperational) {
//     res.status(err.statusCode).render("error", {
//       title: "Something went wrong",
//       msg: err.message,
//     });
//   } else {
//     res.status(err.statusCode).render("error", {
//       title: "Something went wrong",
//       msg: "Please Try again later ",
//     });
//   }
// };

// module.exports = (err, req, res, next) => {
// err.statusCode = err.statusCode || 500;
// err.status = err.status || "error";

//   if (process.env.NODE_ENV === "development") {
//     // console.log(
//     // Object.values(err.errors).map(el => el.message).join(`.
//     //   `)
//     // );
//     // if (err.name === 'ValidationError') err = handleValidationErrorDB(err);

//     sendErrorDev(err, req, res);
//   } else if (process.env.NODE_ENV === "production") {
//     // let error = { ...err };
//     // // error = JSON.parse(...error);
//     // console.log(error.name);
//     // if (error.name === 'CastError') error = handleCastErrorDB(error);
//     if (err.name === "CastError") err = handleCastErrorDB(err);
//     if (err.name === "ValidationError") err = handleValidationErrorDB(err);
//     if (err.code === "MongoServerError") err = handleDuplicateFieldsDB(err);
//     if (err.name === "JsonWebTokenError") err = handleJwtInvalidTokenError();
//     if (err.name === "TokenExpiredError") err = handleJwtExpiredTokenError();

//     sendErrorProd(err, req, res);
//   }
// };

const sendErrorDev = (err, req, res) => {
  // API

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //PROGRAMMING ERROR:  DONT LEAK DETAIL TO CLIENT
    console.error(err, "ERRORRRRRRRRRR");
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went wrong ",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);

    // sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    console.log(error.name);

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);

    sendErrorProd(error, req, res);
  }
};
