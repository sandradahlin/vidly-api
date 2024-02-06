const express = require("express");
const Joi = require("joi");
const Movie = require("../models/Movie");
const router = express.Router();

router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("name");
  res.send(movie);
});

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Bad request");
  }
  const { title, numberInStock, dailyRentalRate, genre } = req.body;

  let newMovie = new Movie({ title, numberInStock, dailyRentalRate, genre });
  newMovie = newMovie.save();
  res.send(newMovie);
});
module.exports = router;
