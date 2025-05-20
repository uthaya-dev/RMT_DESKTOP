// const fs = require("fs");
// const path = require("path");
// const puppeteer = require("puppeteer");
// const handlebars = require("handlebars");
// const {
//   allowInsecurePrototypeAccess,
// } = require("@handlebars/allow-prototype-access");

// // Wrap Handlebars to allow prototype access for Mongoose objects
// const secureHandlebars = allowInsecurePrototypeAccess(handlebars);

// const generateInvoicePDF = async (invoiceData, outputPath) => {
//   const logoPath = path.join(__dirname, "../assets/logo.png");
//   const logoImage = fs.readFileSync(logoPath);
//   const logoBase64 = `data:image/png;base64,${logoImage.toString("base64")}`;

//   // ✅ Format date to DD-MM-YYYY
//   const formatDate = (isoDate) => {
//     const dateObj = new Date(isoDate);
//     const day = String(dateObj.getDate()).padStart(2, "0");
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//     const year = dateObj.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const formattedInvoice = {
//     ...invoiceData.toObject(),
//     logoBase64,
//     date: formatDate(invoiceData.date), // 👈 Format date before injecting
//   };

//   // Load and compile template
//   const templateHtml = fs.readFileSync(
//     path.join(__dirname, "billSample.html"),
//     "utf8"
//   );
//   const template = secureHandlebars.compile(templateHtml);
//   const html = template(formattedInvoice);

//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setViewport({ width: 794, height: 1123 }); // A4 at 96 DPI

//   await page.setContent(html, { waitUntil: "load" });

//   await page.pdf({
//     path: outputPath,
//     width: "210mm",
//     height: "148.5mm",
//     printBackground: true,
//     margin: { top: "2mm", bottom: "2mm" },
//   });

//   await browser.close();
// };

// module.exports = generateInvoicePDF;

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

// Wrap Handlebars to allow prototype access (optional for plain objects but safe to keep)
const secureHandlebars = allowInsecurePrototypeAccess(handlebars);

const generateInvoicePDF = async (invoiceData, outputPath) => {
  const logoPath = path.join(__dirname, "../assets/logo.png");
  const logoImage = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoImage.toString("base64")}`;

  // Format date to DD-MM-YYYY
  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Spread invoiceData directly since it is a plain JS object now
  const formattedInvoice = {
    ...invoiceData,
    logoBase64,
    date: formatDate(invoiceData.date), // Format the date
  };

  // Load and compile Handlebars template
  const templateHtml = fs.readFileSync(
    path.join(__dirname, "billSample.html"),
    "utf8"
  );
  const template = secureHandlebars.compile(templateHtml);
  const html = template(formattedInvoice);

  // Launch Puppeteer with recommended options for server environments
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Set viewport to A4 size at 96 DPI
  await page.setViewport({ width: 794, height: 1123 });

  // Set the page content to the generated HTML
  await page.setContent(html, { waitUntil: "load" });

  // Generate PDF with specified dimensions and options
  await page.pdf({
    path: outputPath,
    width: "210mm",
    height: "148.5mm", // Change to "297mm" for full A4 height if needed
    printBackground: true,
    margin: { top: "2mm", bottom: "2mm" },
  });

  await browser.close();
};

module.exports = generateInvoicePDF;
