const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const connectDB = require("./config/db");

const PORT = 3001;
console.log("Starting server...");

dotenv.config();
// connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => {
  res.send("OK");
});
// Sample route
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/invoices", invoiceRoutes);

// Start server
// const PORT = process.env.PORT || 5000;
app.listen(PORT, "localhost", () => {
  console.log(`Backend server listening at http://localhost:${PORT}`);
});
