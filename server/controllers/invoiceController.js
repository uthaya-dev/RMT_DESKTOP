const {
  CustomerDB,
  InvoiceDB,
  InvoiceCounterDB,
  productsDB,
} = require("../config/dbNeDB");
const numberToWords = require("number-to-words");
const generateInvoicePDF = require("../utils/generateInvoicePDF");
const path = require("path");
const fs = require("fs");
const os = require("os"); // ← it's built-in Node.js, not extra install

exports.createInvoice = async (req, res) => {
  const {
    customer,
    items,
    customerBank,
    customerACNumber,
    accountBranch,
    ifscCode,
    transportationMode,
    vehicleNumber,
    driverName,
    driverContactNumber,
    deliveryPlace,
    crimpingCharges,
    deliveryCharges,
    totalDiscount,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }

  try {
    const customerData = await CustomerDB.findOne({ _id: customer });
    if (!customerData) {
      return res.status(400).json({ message: "Customer not found" });
    }

    const currentYear = new Date().getFullYear().toString();
    let counterDoc = await InvoiceCounterDB.findOne({ year: currentYear });

    if (!counterDoc) {
      counterDoc = await InvoiceCounterDB.insert({
        year: currentYear,
        lastInvoiceNumber: 0,
      });
    }

    const invoiceNumber = `${currentYear}-${String(
      counterDoc.lastInvoiceNumber + 1
    ).padStart(3, "0")}`;

    // Update counter async
    const updateCounter = async () => {
      await InvoiceCounterDB.update(
        { year: currentYear },
        { $set: { lastInvoiceNumber: counterDoc.lastInvoiceNumber + 1 } }
      );
    };

    // === Prepare item details ===
    let totalAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalQuantity = 0;
    let totalTaxableAmount = 0;
    let totalBaseAmount = 0;
    let totalPieces = 0;

    const processedItems = await Promise.all(
      items.map(async (item, index) => {
        const product = await productsDB.findOne({ _id: item.productId });
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const unit = item.unit;
        const length = unit === "feet" ? Number(item.length) || 0 : 0;
        const pcs = Number(item.pcs) || 0;
        const quantity = unit === "feet" ? length * pcs : pcs;
        const rate = Number(item.rate) || 0;
        const gstRate = Number(item.tax) || 18;

        const baseAmount = parseFloat((quantity * rate).toFixed(3));
        const gstAmount = (baseAmount * gstRate) / 100;
        const cgst = parseFloat((gstAmount / 2).toFixed(2));
        const sgst = parseFloat((gstAmount / 2).toFixed(2));
        const finalAmount = parseFloat((baseAmount + gstAmount).toFixed(2));

        totalBaseAmount += finalAmount;
        totalQuantity += quantity;
        totalTaxableAmount += baseAmount;
        totalAmount += finalAmount;
        totalCGST += cgst;
        totalSGST += sgst;
        totalPieces += pcs;

        return {
          sno: index + 1,
          productId: product._id,
          productName: product.name,
          hsn: product.hsn,
          unit,
          length,
          pcs,
          quantity,
          rate,
          tax: gstRate,
          baseAmount,
          cgst,
          sgst,
          gstAmount,
          finalAmount,
        };
      })
    );

    totalAmount += parseFloat(crimpingCharges) || 0;
    totalAmount += parseFloat(deliveryCharges) || 0;

    const discountAmount = parseFloat(
      ((totalAmount * (Number(totalDiscount) || 0)) / 100).toFixed(2)
    );
    totalAmount -= discountAmount;

    totalAmount = parseFloat(totalAmount.toFixed(3));
    const roundedTotal = Math.round(totalAmount);
    const roundingOff = parseFloat((roundedTotal - totalAmount).toFixed(3));
    totalAmount = roundedTotal;
    const totalGSTAmount = totalCGST + totalSGST;

    const amountInWords =
      numberToWords
        .toWords(totalAmount)
        .replace(/\b\w/g, (l) => l.toUpperCase()) + " Only";

    const gstAmountInWords =
      numberToWords
        .toWords(Math.round(totalGSTAmount))
        .replace(/\b\w/g, (l) => l.toUpperCase()) + " Only";

    const invoiceDoc = {
      customer,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      customerAddress: customerData.address,
      items: processedItems,
      totalBaseAmount,
      totalAmount,
      totalCGST,
      totalSGST,
      totalGSTAmount,
      totalQuantity,
      roundingOff,
      roundedTotal,
      invoiceNumber,
      amountInWords,
      gstAmountInWords,
      totalTaxableAmount,
      customerBank,
      customerACNumber,
      accountBranch,
      ifscCode,
      transportationMode,
      vehicleNumber,
      driverName,
      driverContactNumber,
      deliveryPlace,
      crimpingCharges,
      deliveryCharges,
      totalDiscount,
      totalPieces,
      createdAt: new Date(),
    };

    const savedInvoice = await InvoiceDB.insert(invoiceDoc);
    await updateCounter();

    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  console.log("Request received");
  (async () => {
    const invoices = await InvoiceDB.find({});
    console.log("Invoices in DB:", invoices.length);
  })();

  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    search,
    startDate,
    endDate,
    status = "active",
  } = req.query;

  const sortOrder = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  let filter = {};

  // if (status === "active") {
  //   filter.isDeleted = false;
  // } else if (status === "deleted") {
  //   filter.isDeleted = true;
  // } else if (status !== "all") {
  //   return res.status(400).json({ message: "Invalid status" });
  // }

  if (search) {
    const regex = new RegExp(search, "i");
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
    filter.$or = [
      { customerName: regex },
      { itemNames: regex },
      ...(isObjectId ? [{ _id: search }] : []),
    ];
  }

  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(`${startDate}T00:00:00.000Z`),
      $lte: new Date(`${endDate}T23:59:59.999Z`),
    };
  }

  try {
    const all = await InvoiceDB.find({});
    console.log("All invoices:", all); // ✅ Now this will work

    const totalInvoices = await InvoiceDB.count(filter);
    console.log("Total invoices:", totalInvoices);

    const invoices = await InvoiceDB.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const enrichedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        const customer = await CustomerDB.findOne({ _id: invoice.customerId });

        const enrichedItems = await Promise.all(
          invoice.items.map(async (item) => {
            const product = await productsDB.findOne({ _id: item.productId });
            return {
              ...item,
              productName: product?.name || "Unknown Product",
            };
          })
        );

        return {
          ...invoice,
          customerName: customer?.name || "Unknown Customer",
          items: enrichedItems,
        };
      })
    );

    const totalPages = Math.ceil(totalInvoices / limit);

    res.json({
      invoices: enrichedInvoices,
      totalPages,
      currentPage: parseInt(page),
      totalInvoices,
    });
  } catch (err) {
    console.error("Error in getInvoices:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await InvoiceDB.findOne({ _id: id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Fetch customer info manually
    const customer = await CustomerDB.findOne({ _id: invoice.customerId });

    // Enrich items with product details
    const enrichedItems = await Promise.all(
      (invoice.items || []).map(async (item) => {
        const product = await productsDB.findOne({ _id: item.productId });
        return {
          ...item,
          productName: product?.name || "Unknown Product",
          productDetails: product || null,
        };
      })
    );

    // Prepare response
    const enrichedInvoice = {
      ...invoice,
      customer: customer || null,
      items: enrichedItems,
    };

    res.json(enrichedInvoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.previewInvoicePDF = async (req, res) => {
  console.log("work");
  try {
    const invoice = await InvoiceDB.findOne({ _id: req.params.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Manually get customer data
    const customer = await CustomerDB.findOne({ _id: invoice.customerId });
    invoice.customer = customer || null;
    const tempDir = path.join(os.tmpdir(), "invoices"); // Always writable
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const tempPath = path.join(tempDir, `invoice-${invoice._id}.pdf`);
    await generateInvoicePDF(invoice, tempPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline"); // preview inline

    const fileStream = fs.createReadStream(tempPath);
    fileStream.pipe(res);

    fileStream.on("close", () => {
      fs.unlink(tempPath, (err) => {
        if (err) console.error("Failed to delete temp PDF:", err);
      });
    });
  } catch (err) {
    console.error(err);
    console.error("Error in previewInvoicePDF:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await InvoiceDB.findOne({ _id: req.params.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Manually get customer data
    const customer = await CustomerDB.findOne({ _id: invoice.customerId });
    invoice.customer = customer || null;

    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const tempPath = path.join(tempDir, `invoice-${invoice._id}.pdf`);
    await generateInvoicePDF(invoice, tempPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`
    );

    const fileStream = fs.createReadStream(tempPath);
    fileStream.pipe(res);

    fileStream.on("close", () => {
      fs.unlink(tempPath, (err) => {
        if (err) console.error("Failed to delete temp PDF:", err);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// // @desc    Get invoices with optional status, pagination, sorting, search, and date filter
// exports.getInvoices = async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     sortBy = "createdAt",
//     order = "desc",
//     search,
//     startDate,
//     endDate,
//     status = "active", // default status
//   } = req.query;

//   const sortOrder = order === "asc" ? 1 : -1;
//   const skip = (page - 1) * limit;

//   let filter = {};

//   const invoice = await Invoice.findById("681f22235062ea886da3a37f");
//   // Apply status filter
//   if (status === "active") {
//     filter.isDeleted = false;
//   } else if (status === "deleted") {
//     filter.isDeleted = true;
//   } else if (status !== "all") {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   // Apply search filter
//   if (search) {
//     const isObjectId = /^[0-9a-fA-F]{24}$/.test(search); // check if search is a valid ObjectId

//     filter = {
//       ...filter,
//       $or: [
//         { customerName: { $regex: search, $options: "i" } },
//         { itemNames: { $regex: search, $options: "i" } },
//         ...(isObjectId ? [{ _id: search }] : []), // add _id match only if it's a valid ObjectId
//       ],
//     };
//   }

//   // Apply full-day date range filter
//   if (startDate && endDate) {
//     filter.date = {
//       $gte: new Date(`${startDate}T00:00:00.000Z`),
//       $lte: new Date(`${endDate}T23:59:59.999Z`),
//     };
//   }

//   try {
//     const invoices = await Invoice.find(filter)
//       .populate("customer")
//       .populate("items.productId")
//       .sort({ [sortBy]: sortOrder })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalInvoices = await Invoice.countDocuments(filter);
//     const totalPages = Math.ceil(totalInvoices / limit);

//     res.json({
//       invoices,
//       totalPages,
//       currentPage: parseInt(page),
//       totalInvoices,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
