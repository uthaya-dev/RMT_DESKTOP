// models/InvoiceCounter.js

const mongoose = require("mongoose");

const invoiceCounterSchema = new mongoose.Schema({
  year: { type: String, required: true },
  lastInvoiceNumber: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("InvoiceCounter", invoiceCounterSchema);
