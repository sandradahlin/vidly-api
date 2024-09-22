const express = require("express");
const Joi = require("joi");
const Movie = require("../models/Movie");
const { Genre } = require("../models/Genre");
const router = express.Router();

router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("name");
  res.send(movie);
});

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Bad request");
  }
  // const { title, numberInStock, dailyRentalRate, genre } = req.body;

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalida genre.");

  // let newMovie = new Movie({ title, numberInStock, dailyRentalRate, genre });

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();

  res.send(movie);
});
module.exports = router;
