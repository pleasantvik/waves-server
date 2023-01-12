const express = require("express");
const formidable = require("express-formidable");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/paginate/all").post(productController.paginateProducts);
router.route("/upload").post(
  authController.protect,
  authController.restrictTo("admin"),

  formidable(),
  productController.upload
);

router
  .route("/")
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.addProduct
  );

// .post(tourControl.createTour);
// app.use(authController.protect);
router
  .route("/:id")
  .get(authController.protect, productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
