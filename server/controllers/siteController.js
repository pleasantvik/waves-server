const Site = require("../model/siteModel");
// const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");

exports.getSite = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedField = ["page", "sort", "limit"];

  excludedField.forEach((el) => delete queryObj[el]);
  const query = Site.find(queryObj);
  const site = await query;
  if (!site) return next(new AppError("Site not found", httpStatus.NOT_FOUND));
  res.status(200).json({
    status: "success",
    results: site.length,
    data: site,
  });
});

exports.addSite = catchAsync(async (req, res, next) => {
  const site = await Site.create(req.body);

  res.status(200).json({
    status: "success",
    data: site,
  });
});

exports.updateSite = catchAsync(async (req, res, next) => {
  const site = await Site.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!site)
    return next(
      new AppError("No product found with the ID"),
      httpStatus.NOT_FOUND
    );

  res.status(200).json({
    status: "success",
    data: {
      site,
    },
  });
});

// exports.getSite = catchAsync(async (req, res, next) => {
//   const Site = await Site.findById(req.params.id);
//   if (!Site)
//     return next(
//       new AppError("No Site found with the ID"),
//       httpStatus.NOT_FOUND
//     );

//   res.status(200).json({
//     status: "success",
//     data: {
//       Site,
//     },
//   });
// });

// exports.deleteSite = catchAsync(async (req, res, next) => {
//   const Site = await Site.findByIdAndDelete(req.params.id);
//   if (!Site)
//     return next(
//       new AppError("No brand found with the ID"),
//       httpStatus.NOT_FOUND
//     );
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
