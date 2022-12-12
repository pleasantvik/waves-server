const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

// router.param('id', tourController.checkID);

// router
//   .route("/top-5-cheap")
//   .get(tourController.aliasTopTours, tourController.getAllTours);

// router.route("/tour-stats").get(tourController.getTourStats);
// router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, productController.getProducts)
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
  // .patch(brandController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
