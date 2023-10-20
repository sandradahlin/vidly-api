const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
  phone: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
});

module.exports = mongoose.model("Customer", customerSchema);
