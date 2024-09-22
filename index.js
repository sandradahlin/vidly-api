const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const customersRouter = require("./routes/customers");
const genresRouter = require("./routes/genres");
const moviesRouter = require("./routes/movies");
const rentalsRouter = require("./routes/routes");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

// check if jwt private key is setup
if(!config.get('jwtPrivateKey')){
  console.error('jwt key is not defined')
  process.exit(1)
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error(error));

app.use(express.json());

app.use("/genres", genresRouter);
app.use("/customers", customersRouter);
app.use("/movies", moviesRouter);
app.use("/rentals", rentalsRouter);
app.use("/rentals", usersRouter);
app.use("/auth", authRouter);


app.listen(3000, () => "Listening on 3000...");
