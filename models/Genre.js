const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = mongoose.model("Genre", genreSchema);
exports.validate = validateGenre;

// module.exports = mongoose.model("Genre", genreSchema);
