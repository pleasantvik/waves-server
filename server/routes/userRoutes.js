const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// // MULTER CONFIG

const router = express.Router();

router.get("/isauth", authController.isAuth);
//AUTHENTICATION ROUTE
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
// router.get("/isauth", authController.isauth);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
//Update user profile
router.get("/profile", authController.protect, userController.profile);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

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
