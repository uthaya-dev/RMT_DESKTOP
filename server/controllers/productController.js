// const Product = require("../models/Product");

// // @desc    Get all products
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// exports.createProduct = async (req, res) => {
//   const { name, hsn } = req.body;
//   // const gst = req.body.gst ?? 18;
//   // const rateInc = rate * (1 + gst / 100);

//   try {
//     const product = new Product({ name, hsn });
//     const saved = await product.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // @desc    Update a product
// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { name, hsn } = req.body;

//   try {
//     const product = await Product.findByIdAndUpdate(
//       id,
//       { name, hsn },
//       { new: true }
//     );
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     res.json(product);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // @desc    Delete a product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const deleted = await Product.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const { productsDB } = require("../config/dbNeDB");

// @desc    Get all products
exports.getProducts = async (req, res) => {
  console.log("Received get products request");
  try {
    const docs = await productsDB.find({});
    console.log("Products in DB:", docs);
    res.json(docs);
  } catch (err) {
    console.error("NeDB find error:", err);
    res.status(500).json({ message: err.message });
  }
};
// @desc    Create a product
exports.createProduct = async (req, res) => {
  try {
    const { name, hsn } = req.body;
    const newProduct = { name, hsn };
    const doc = await productsDB.insert(newProduct);
    res.status(201).json(doc);
  } catch (err) {
    console.error("NeDB insert error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, hsn } = req.body;

  try {
    // The 'update' method returns number of documents updated when not using 'returnUpdatedDocs'.
    // To get the updated doc, you can use 'findOne' after update.
    const numAffected = await productsDB.update(
      { _id: id },
      { $set: { name, hsn } },
      { returnUpdatedDocs: false }
    );

    if (numAffected === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch the updated document
    const updatedDoc = await productsDB.findOne({ _id: id });

    res.json(updatedDoc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const numRemoved = await productsDB.remove({ _id: id }, {});

    if (numRemoved === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
