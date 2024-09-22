// create new
const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const { validate } = require("../models/User");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(rentals);
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

  res.send(_.pick(user, ["name", "email"]));
});
module.exports = router;
