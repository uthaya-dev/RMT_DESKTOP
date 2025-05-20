// // @desc Create an invoice using NeDB
// const Datastore = require("nedb-promises");
// const path = require("path");
// const numberToWords = require("number-to-words");
// const userDataPath = path.join(process.cwd(), "data");

// // Load NeDB databases
// const InvoiceDB = Datastore.create({
//   filename: path.join(userDataPath, "../db/Invoice.db"),
//   autoload: true,
// });
// const CustomerDB = Datastore.create({
//   filename: path.join(userDataPath, "../db/Customer.db"),
//   autoload: true,
// });
// const productsDB = Datastore.create({
//   filename: path.join(userDataPath, "../db/Product.db"),
//   autoload: true,
// });
// const InvoiceCounterDB = Datastore.create({
//   filename: path.join(userDataPath, "../db/InvoiceCounter.db"),
//   autoload: true,
// });

// module.exports = { productsDB, CustomerDB, InvoiceDB, InvoiceCounterDB };

// @desc Create an invoice using NeDB
const Datastore = require("nedb-promises");
const path = require("path");
const fs = require("fs");
const numberToWords = require("number-to-words");

// Ensure writable folder exists
const userDataPath = path.join(process.cwd(), "data");
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

// Load NeDB databases from the writable folder
const InvoiceDB = Datastore.create({
  filename: path.join(userDataPath, "Invoice.db"),
  autoload: true,
});
const CustomerDB = Datastore.create({
  filename: path.join(userDataPath, "Customer.db"),
  autoload: true,
});
const productsDB = Datastore.create({
  filename: path.join(userDataPath, "Product.db"),
  autoload: true,
});
const InvoiceCounterDB = Datastore.create({
  filename: path.join(userDataPath, "InvoiceCounter.db"),
  autoload: true,
});

module.exports = { productsDB, CustomerDB, InvoiceDB, InvoiceCounterDB };
