const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,
    gstNumber: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
