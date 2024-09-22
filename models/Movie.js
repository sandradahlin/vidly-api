const mongoose = require("mongoose");
const { genreSchema } = require("./Genre");
const Joi = require("joi");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
      trim: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min().required(),
  };
  return Joi.validate(movie, schema);
}

// module.exports = mongoose.model("Movie", movieSchema);
exports.Movie = mongoose.model("Movie", movieSchema);
exports.validate = validateMovie;
