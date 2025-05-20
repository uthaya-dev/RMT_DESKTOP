const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hsn: { type: String, required: true },
    // rate: { type: Number, required: true },
    // rateInc: { type: Number },
    // per: { type: String, default: "no's", required: true },
    // gst: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
