const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

// Read JSON data from file
const readData = (filename) => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

// Write JSON data to file
const writeData = (filename, data) => {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };
