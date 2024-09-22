// create new
const mongoose = require("mongoose");
const express = require("express");
const { Rental } = require("../models/Rental");
const { validate } = require("../models/Rental");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");
const Fawn = reuire("fawn");
const router = express.Router();

Fawn.init(mongoose);

//"-"" in sorting is for descending order
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

//   if(!mongoose.Types.ObjectId.isValid(req.body.customerId)){
//     return res.status(400)
//   }
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send(" Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  //   rental = await rental.save();

  //   // two phase commit - as rental saving can crash an we need to perform movie saving
  //   // Transaction
  //   movie.numberInStock--;
  //   movie.save();
  try {
    new Fawn.Task()
      // we pass in name of the collections in the db
      .save("rentals", rental)
      .update("movies, {_id: movie._id", {
        $inc: { numberInStock: -1 },
      })
      .run();
  } catch (error) {
    res.status(500).send(error);
    // Log error
  }

  res.send(rental);
});
