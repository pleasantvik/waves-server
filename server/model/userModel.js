// const crypto = require('crypto');
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "The email field is a required field"],
    validate: [validator.isEmail, "A user must have a valid email"],
    unique: true,
    lowerCase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: [8, "Password should have minimum of 8 character"],
    required: [true, "Password field is required"],
    trim: true,
    select: false,
  },
  firstname: {
    type: String,
    maxLength: [50, "Firstname should have maximum of 50 character"],
    trim: true,
    default: "",
  },
  lastname: {
    type: String,
    maxLength: [50, "Lastname should have maximum of 50 character"],
    trim: true,
    default: "",
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  verified: {
    type: Boolean,
    default: false,
  },

  //   email: {

  //   },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  //   password: {

  //   },
  confirmPassword: {
    type: String,
    trim: true,
    required: [true, "Please confirm your password"],
    validate: {
      //This works only on create and update
      validator: function (value) {
        return value === this.password;
      },
      message: "Password are not the same",
    },
  },
  //   passwordChangedAt: Date,
  //   passwordResetToken: String,
  //   passwordResetExpires: Date,
  //   active: {
  //     type: Boolean,
  //     default: true,
  //     select: false
  //   }
});

//THIS RUNS BEFORE THE USER INSTANCE IS SAVED
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
// userSchema.methods.correctPassword = async function(
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// userSchema.pre('save', function(next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 1000;

//   next();
// });

// userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
//   if (this.passwordChangedAt) {
//     const passwordChangeTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     // console.log(passwordChangeTimestamp, JWTTimeStamp);
//     return JWTTimeStamp < passwordChangeTimestamp; // if this is true, it means user changed password
//   }

//   // If we return false it means the password didnt change
//   return false;
// };

// userSchema.methods.createPasswordResetToken = function() {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   // console.log({
//   //   resetToken,
//   //   encryptVersion: this.passwordResetToken,
//   //   expire: this.passwordResetExpires
//   // });

//   return resetToken;
// };

// //QUERY MIDDLEWARE TO HIDE A DOCUMENT
// userSchema.pre(/^find/, function(next) {
//   this.find({ active: { $ne: false } });
//   next();
// });
const User = mongoose.model("User", userSchema);

module.exports = User;
