const Product = require("../model/productModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");

exports.getProducts = catchAsync(async (req, res, next) => {
  //FOR NESTED GET REVIEWS ON TOUR
  let filter;
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const features = new APIFeatures(
    Product.find(filter).populate("brand"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  res.status(httpStatus.OK).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
    },
  });
});
exports.addProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.paginateProducts = catchAsync(async (req, res, next) => {
  let aggQueryArray = [];

  if (req.body.keywords && req.body.keywords != "") {
    const re = new RegExp(`${req.body.keywords}`, "gi");
    aggQueryArray.push({
      $match: { model: { $regex: re } },
    });
  }

  if (req.body.brand && req.body.brand.length > 0) {
    let newBrandsArray = req.body.brand.map((item) =>
      mongoose.Types.ObjectId(item)
    );
    aggQueryArray.push({
      $match: { brand: { $in: newBrandsArray } },
    });
  }

  if (req.body.frets && req.body.frets.length > 0) {
    aggQueryArray.push({
      $match: { frets: { $in: req.body.frets } },
    });
  }

  if (
    (req.body.min && req.body.min > 0) ||
    (req.body.max && req.body.max < 5000)
  ) {
    /// { $range: { price:[0,100 ]}} /// not supported

    if (req.body.min) {
      aggQueryArray.push({ $match: { price: { $gt: req.body.min } } });
      /// minimum price , guitar with a price greater than xxx
    }
    if (req.body.max) {
      aggQueryArray.push({ $match: { price: { $lt: req.body.max } } });
      /// maximum price , guitar with a price lower than xxx
    }
  }

  //// add populate
  aggQueryArray.push(
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    { $unwind: "$brand" }
  );
  /////////

  let aggQuery = Product.aggregate(aggQueryArray);
  const options = {
    page: req.body.page,
    limit: 2,
    sort: { date: "desc" },
  };
  const products = await Product.aggregatePaginate(aggQuery, options);
  res.status(200).json({
    status: "success",
    data: {
      result: products.length,
      products,
    },
  });
});

// exports.aliasTopTours = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.fields = "name,price,ratingsAverage,summary,difficulty";
//   next();
// };

// exports.getAllTours = catchAsync(async (req, res) => {
//   // EXECUTE QUERY
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("brand");
  if (!product)
    return next(
      new AppError("No product found with the ID"),
      httpStatus.NOT_FOUND
    );

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product)
    return next(
      new AppError("No product found with the ID"),
      httpStatus.NOT_FOUND
    );

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return next(
      new AppError("No product found with the ID"),
      httpStatus.NOT_FOUND
    );
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// exports.createTour = catchAsync(async (req, res) => {
//   // const newTour = new Tour({})
//   // newTour.save()

//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour)
//     return next(
//       new AppError("No tour found with the ID"),
//       httpStatus.NOT_FOUND
//     );

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// });

// exports.getTourStats = catchAsync(async (req, res) => {
//   const stats = await Tour.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } },
//     },
//     {
//       $group: {
//         _id: { $toUpper: "$difficulty" },
//         numTours: { $sum: 1 },
//         numRatings: { $sum: "$ratingsQuantity" },
//         avgRating: { $avg: "$ratingsAverage" },
//         avgPrice: { $avg: "$price" },
//         minPrice: { $min: "$price" },
//         maxPrice: { $max: "$price" },
//       },
//     },
//     {
//       $sort: { avgPrice: 1 },
//     },
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       stats,
//     },
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res) => {
//   const year = req.params.year * 1; // 2021

//   const plan = await Tour.aggregate([
//     {
//       $unwind: "$startDates",
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $month: "$startDates" },
//         numTourStarts: { $sum: 1 },
//         tours: { $push: "$name" },
//       },
//     },
//     {
//       $addFields: { month: "$_id" },
//     },
//     {
//       $project: {
//         _id: 0,
//       },
//     },
//     {
//       $sort: { numTourStarts: -1 },
//     },
//     {
//       $limit: 12,
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       plan,
//     },
//   });
// });
