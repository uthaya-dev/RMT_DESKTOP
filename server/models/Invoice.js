// const mongoose = require("mongoose");

// const invoiceSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//       required: true,
//     },
//     customerName: { type: String }, // Flattened for text search
//     customerEmail: String,
//     customerPhone: String,
//     customerAddress: String,

//     items: [
//       {
//         sno: { type: Number, required: true },
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//         productName: { type: String }, // renamed from `name`
//         hsn: { type: String },
//         per: { type: String },
//         rateInc: { type: Number },
//         quantity: { type: Number, required: true },
//         price: { type: Number, required: true },
//         baseAmount: { type: Number },
//         discount: { type: Number, default: 0 },
//         taxableAmount: { type: Number },
//         gstRate: { type: Number, default: 18 },
//         halfGst: { type: Number },
//         gstAmount: { type: Number },
//         cgst: { type: Number },
//         sgst: { type: Number },
//         finalAmount: { type: Number },
//       },
//     ],

//     // Text search
//     itemNames: { type: String },

//     // Totals
//     totalAmount: { type: Number }, // final total after all calculations
//     totalCGST: { type: Number, default: 0 },
//     totalSGST: { type: Number, default: 0 },
//     totalQuantity: { type: Number },
//     subtotal: { type: Number }, // optional: sum of base amounts
//     discount: { type: Number, default: 0 },
//     gstTotal: { type: Number, default: 0 }, // total GST (CGST + SGST)
//     roundingOff: { type: Number, default: 0 },
//     grandTotal: { type: Number }, // optional: final payable total
//     paid: { type: Number, default: 0 },
//     balance: { type: Number },

//     isDeleted: { type: Boolean, default: false },
//     date: { type: Date, default: Date.now },
//     invoiceNumber: { type: String, required: true },
//     amountInWords: { type: String, required: true },
//     gstAmountInWords: { type: String, required: true },
//     totalTaxableAmount: { type: Number },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Text index
// invoiceSchema.index({ customerName: "text", "items.productName": "text" });

// // Pre-save for flattened fields
// invoiceSchema.pre("save", async function (next) {
//   const Customer = mongoose.model("Customer");

//   // Set customerName
//   if (this.isModified("customer")) {
//     const customer = await Customer.findById(this.customer);
//     if (customer) {
//       this.customerName = customer.name;
//     }
//   }

//   // Flatten item names
//   if (this.isModified("items")) {
//     this.itemNames = this.items.map((item) => item.productName).join(" ");
//   }

//   // Optional: calculate subtotal, gstTotal, grandTotal, etc.
//   // If already calculated in controller, you can skip this
//   next();
// });

// module.exports = mongoose.model("Invoice", invoiceSchema);

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: { type: String }, // Flattened for text search
    customerEmail: String,
    customerPhone: String,
    customerAddress: String,

    items: [
      {
        sno: { type: Number, required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: { type: String, required: true }, // kept productName
        hsn: { type: String },

        unit: { type: String, enum: ["feet", "No's"], required: true },
        length: { type: Number, default: 0 }, // Used if unit is feet
        pcs: { type: Number, required: true }, // Pieces
        quantity: { type: Number, required: true }, // Calculated in controller
        rate: { type: Number, required: true },
        tax: { type: Number, default: 18 }, // GST percentage

        amount: { type: Number }, // Qty * Rate * (1 + tax%)

        // GST calculations (optional but recommended)
        gstRate: { type: Number, default: 18 },
        halfGst: { type: Number },
        cgst: { type: Number },
        sgst: { type: Number },
        gstAmount: { type: Number },
        taxableAmount: { type: Number },
        discount: { type: Number, default: 0 },
        baseAmount: { type: Number },
        finalAmount: { type: Number },
      },
    ],

    customerBank: { type: String },
    customerACNumber: { type: String },
    accountBranch: { type: String },
    ifscCode: { type: String },
    transportationMode: { type: String },
    vehicleNumber: { type: String },
    driverName: { type: String },
    driverContactNumber: { type: String },
    deliveryPlace: { type: String },
    totalDiscount: { type: Number, default: 0 },
    // Text search
    itemNames: { type: String },

    // Totals

    totalBaseAmount: { type: Number }, // final total after all calculations
    totalAmount: { type: Number }, // final total after all calculations
    totalCGST: { type: Number },
    totalSGST: { type: Number },
    totalGSTAmount: { type: Number },
    totalQuantity: { type: Number },
    totalPieces: { type: Number },
    subtotal: { type: Number }, // optional: sum of base amounts
    discount: { type: Number, default: 0 },
    gstTotal: { type: Number, default: 0 }, // total GST (CGST + SGST)
    roundingOff: { type: Number, default: 0 },
    grandTotal: { type: Number }, // optional: final payable total
    paid: { type: Number, default: 0 },
    balance: { type: Number },

    isDeleted: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    invoiceNumber: { type: String, required: true },
    amountInWords: { type: String, required: true },
    gstAmountInWords: { type: String, required: true },
    totalTaxableAmount: { type: Number },
    crimpingCharges: { type: Number },
    deliveryCharges: { type: Number },
  },
  {
    timestamps: true,
  }
);

// Text index
invoiceSchema.index({ customerName: "text", "items.productName": "text" });

// Pre-save for flattened fields
invoiceSchema.pre("save", async function (next) {
  const Customer = mongoose.model("Customer");

  // Set customerName
  if (this.isModified("customer")) {
    const customer = await Customer.findById(this.customer);
    if (customer) {
      this.customerName = customer.name;
    }
  }

  // Flatten item names
  if (this.isModified("items")) {
    this.itemNames = this.items.map((item) => item.productName).join(" ");
  }

  // Optional: calculate subtotal, gstTotal, grandTotal, etc.
  // If already calculated in controller, you can skip this
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
