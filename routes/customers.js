const express = require("express");
const Customer = require("../models/Customer");
const Joi = require("joi");
const router = express.Router();

router.get("/", async (req, res) => {
  const allCustomers = await Customer.find();
  res.send(allCustomers);
});

router.post("/", async (req, res) => {
  const { isGold, name, phone } = req.body;
//   const { error } = validateCustomer(req.body); // add validation

  if (isGold === undefined || !name || !phone)
    return res.status(400).send("Bad request");

  let newCustomer = new Customer({
    isGold,
    name,
    phone,
  });

  newCustomer = await newCustomer.save();
  res.send(newCustomer);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Bad request");
  const customer = await Customer.findByIdAndRemove(id);
  if (!customer)
    return res.status(404).send("The customer with this id cannot be found.");
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id || !name) return res.status(400).send("Bad request");

  const customer = await Customer.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("The customer with this id cannot be found.");

  res.send(customer);
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean(),
  };

  return Joi.validate(customer, schema);
}

module.exports = router;
