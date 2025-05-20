const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  // updateInvoice,
  // deleteInvoice,
  // restoreInvoice,
  // deleteInvoicePermanently,
  // getInvoicesByStatus,
  downloadInvoicePDF,
  previewInvoicePDF,
} = require("../controllers/invoiceController");

router.post("/", createInvoice);
// router.get("/status", getInvoicesByStatus);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
// router.patch("/:id", updateInvoice);
// router.delete("/:id", deleteInvoice); // soft delete
// router.patch("/:id/restore", restoreInvoice);
// router.delete("/:id/permanent", deleteInvoicePermanently);
router.get("/:id/download", downloadInvoicePDF);
router.get("/:id/preview", previewInvoicePDF);

module.exports = router;
