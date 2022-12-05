const mongoose = require("mongoose");
// const slugify = require("slugify");
// const validator = require("validator");
// const User = require('./userModel');

// SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxLength: [40, "A tour name must have less or equal to 40 character"],
    minLength: [10, "A tour name must have more or equal to 10 character"],
  },
  slug: String,
  myName: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "DIfficulty can either be easy, medium or dificult",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1"],
    max: [5, "Rating must be below 6"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a price"],
  },
  description: {
    type: String,
    required: [true, "A tour must have a description"],
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    required: [true, "A tour must have a cover image"],
  },
  startDates: [Date],
});

// // tourSchema.index({ price: 1 });
// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });
// //VIRTUAL PROPERTY
// tourSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

//CONNECTING TWO MODELS TOGETHER WITH VIRTULA POPULATE, without using child referenincing: the foreignFields is the name  given in the child, and the localField is what we use in the identification
// tourSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'tour',
//   localField: '_id'
// });

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
// tourSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   // this.myName = 'Adedayo';
//   next();
// });
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
//EMBEDDING GUIDES
/**
 * tourSchema.pre('save', async function(next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
 */

// tourSchema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// });
// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt'
//   });
//   next();
// });
// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`It took ${Date.now() - this.start} millisec`);
//   next();
// });

//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });
// //Tour Model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
