const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  numberInStock: {
    type: Number,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
  genre:{
    type: Array,
    required: true,
  }
});

module.exports = mongoose.model("Movie", movieSchema);
