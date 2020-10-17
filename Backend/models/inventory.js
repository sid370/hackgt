const mongoose = require("mongoose");
const InventoryScema = mongoose.Schema({
  previousHash : {type : String, required : true},
  hash : {type : String, required : true},
  _id: {type : String, required : true, unique : true},
  vendorID : {type : String, required : true},
  vendorName : {type : String, required : true},
  batch_id: { type: Number, required : true},
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
