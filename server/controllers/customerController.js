const { CustomerDB } = require("../config/dbNeDB");

// @desc    Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await CustomerDB.find({});
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new customer
exports.createCustomer = async (req, res) => {
  const { name, phone, email, address, gstNumber } = req.body;
  const gstinRegex =
    /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  try {
    if (gstNumber && !gstinRegex.test(gstNumber)) {
      return res.status(400).json({ message: "Invalid GST Number format" });
    }
    const newCustomer = { name, phone, email, address, gstNumber };
    console.log("req recieved");
    const saved = await CustomerDB.insert(newCustomer);
    console.log(saved);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;

  try {
    const numUpdated = await CustomerDB.update(
      { _id: id },
      { $set: { name, phone, email, address } },
      { returnUpdatedDocs: true }
    );

    // NeDB's update returns number updated, but nedb-promises returns number updated OR updated doc?
    // To be safe, fetch updated doc after update
    if (numUpdated === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updatedCustomer = await CustomerDB.findOne({ _id: id });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const numRemoved = await CustomerDB.remove({ _id: id });
    if (numRemoved === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
