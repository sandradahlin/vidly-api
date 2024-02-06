const express = require("express");
const mongoose = require("mongoose");
const genresRouter = require("./routes/genres");
const customersRouter = require("./routes/customers");
const moviesRouter = require("./routes/movies");

const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error(error));

app.use(express.json());

app.use("/genres", genresRouter);
app.use("/customers", customersRouter);
app.use("/movies", moviesRouter);

app.listen(3000, () => "Listening on 3000...");
