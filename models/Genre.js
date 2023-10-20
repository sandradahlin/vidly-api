const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  }
});

module.exports = mongoose.model("Genre", genreSchema);
