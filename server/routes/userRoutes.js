const express = require("express");
// const userController = require("./../controllers/userController");
// const authController = require("./../controllers/authController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// // MULTER CONFIG

const router = express.Router();

//AUTHENTICATION ROUTE
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/isauth", authController.isauth);
router.get("/forgotPassword", authController.forgotPassword);
router.get("/resetPassword", authController.resetPassword);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

// router.post("/login", authController.login);
// router.get("/logout", authController.logout);
// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

// router.use(authController.protect);

// router.patch(
//   "/updateMyPassword",

//   authController.updatePassword
// );

// //Update user profile
// router.get(
//   "/me",

//   userController.getMe,
//   userController.getUser
// );
// router.patch(
//   "/updateMe",
//   userController.uploadUserPhoto,
//   userController.resizeUserPhoto,
//   userController.updateMe
// );
// //Delete user profile
// router.delete("/deleteMe", userController.deleteMe);

// router.use(authController.restrictTo("admin"));

// router
//   .route("/")
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route("/:id")
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
