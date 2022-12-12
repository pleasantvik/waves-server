const express = require("express");
const brandController = require("../controllers/brandController");
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
  .get(authController.protect, brandController.getBrands)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    brandController.addBrand
  );

// .post(tourControl.createTour);
// app.use(authController.protect);
router
  .route("/:id")
  .get(authController.protect, brandController.getBrand)
  // .patch(brandController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    brandController.deleteBrand
  );

module.exports = router;
