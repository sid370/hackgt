const mongoose = require("mongoose");
const InventoryScema = mongoose.Schema({
  _id: String,
  batch_id: { type: Number, unique: true },
  quantity: { type: Number },
  value: { type: Number },
  man_date: { type: Date },
  exp_date: { type: Date },
  location: { type: String },
  lat_long: { type: String },
  recieved_on: { type: Date },
  dispatched_on: { type: Date },
  item_class: { type: String },
  damage: { type: String },
});

module.exports = mongoose.model("inventory", InventoryScema);
