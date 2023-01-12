const Product = require("../model/productModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: "daqyjgkwc",
  api_key: "353638758457753",
  api_secret: process.env.CLOUDINARY_KEY,
});

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

exports.upload = catchAsync(async (req, res, next) => {
  const upload = await cloudinary.uploader.upload(req.files.file.path, {
    public_id: `${Date.now()}`,
    folder: "waves_upload",
  });

  // console.log(upload);
  const pic = {
    public_id: upload.public_id,
    url: upload.url,
  };
  res.status(200).json({ data: pic });
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
    limit: 3,
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
