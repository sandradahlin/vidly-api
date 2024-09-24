// create new
const mongoose = require("mongoose");
const _ = require("lodash");
// const config = require("config");
// const jwt = require("jsonwebtoken");
const express = require("express");
const { validate } = require("../models/User");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const router = express.Router();

// router.get("/", async (req, res) => {
//   const users = await User.find();
//   res.send(rentals);
// });

// Get the current user
router.get("/me", auth, async (req, res) => {
  const user = await User.fincById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // const {error} = validate(req.body)
  // if(error) return res.status(400).send(error.details[0].message)
  if (!req.body || !req.body.name) return res.status(400).send("Bad request");
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});
module.exports = router;
