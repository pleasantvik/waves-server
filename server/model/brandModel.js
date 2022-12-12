const mongoose = require("mongoose");
// const slugify = require("slugify");
// const validator = require("validator");
// const User = require('./userModel');

// SCHEMA
const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A brand must have a name"],
    unique: true,
    trim: true,
    maxLength: [100, "A brand name must have less or equal to 40 character"],
  },
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
