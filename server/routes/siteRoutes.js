const express = require("express");
const siteController = require("../controllers/siteController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(siteController.getSite)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    siteController.addSite
  );
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    siteController.updateSite
  );

// .post(tourControl.createTour);
// app.use(authController.protect);
// router
//   .route("/:id")
//   .get(authController.protect, productController.getProduct)
//   .patch(
//     authController.protect,
//     authController.restrictTo("admin"),
//     productController.updateProduct
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin"),
//     productController.deleteProduct
//   );

module.exports = router;
