const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const httpStatus = require("http-status");
const AppError = require("./utils/appError");
// const globalErrorHandler = require('./controllers/errorController');
const globalErrorHandler = require("./controllers/errorController");
// const authRouter = require("./routes/authRoutes");
// const tourRouter = require("./routes/tourRoutes");
// const userRouter = require("./routes/userRoutes");
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");

// const tourRouter = require("./routes/tourRoutes");
// const userRouter = require("./routes/userRoutes");
// const reviewRouter = require("./routes/reviewRoute");
// const bookingRouter = require("./routes/bookingRoute");
// const viewRouter = require("./routes/viewRoute");

const app = express();
// TELL EXPRESS THE TEMPLATE ENGINE TO USE

//BODY PARSER

app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

// app.use("/", viewRouter);
app.use("/api/users", userRouter);
app.use("/api/tours", tourRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);
// app.use("/api/v1/bookings", bookingRouter);

// Unhandled Route
app.all("*", (req, res, next) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));

  next(
    new AppError(
      `Cant find ${req.originalUrl} on this server`,
      httpStatus.NOT_FOUND
    )
  );
});

//ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
