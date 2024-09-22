// create new
const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(rentals);
});

router.post("/", async (req, res) => {
  // const {error} = validate(req.body)
  // add function for validating user input
  // if(error) return res.status(400).send(error.details[0].message)
  if (!req.body || !req.body.name) return res.status(400).send("Bad request");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or passwor");

  // check the hashed password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // we return json web tocken
  // add payload and secret private key
  const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  res.send(token);
});
module.exports = router;
