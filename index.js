const express = require("express");
const mongoose = require("mongoose");
const genresRouter = require("./genres");
const app = express();

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error(error));

app.use(express.json());

app.use("/genres", genresRouter);

app.listen(3000, () => "Listening on 3000...");
