import { useState, useEffect } from "react";
import axios from "axios";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { createInvoice } from "../services/invoiceService";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const initialInvoice = {
    customer: "",
    items: [],
    customerBank: "",
    customerACNumber: "",
    accountBranch: "",
    ifscCode: "",
    transportationMode: "",
    vehicleNumber: "",
    driverName: "",
    driverContactNumber: "",
    deliveryPlace: "",
    crimpingCharges: 0,
    deliveryCharges: 0,
    totalDiscount: 0,
    paid: 0,
    date: new Date().toISOString().split("T")[0],
  };
  const [invoice, setInvoice] = useState(initialInvoice);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await getCustomers();
        const productRes = await getProducts();
        setCustomers(customerRes);
        setProducts(productRes);
      } catch (err) {
        console.error("Failed to fetch customers or products", err);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  // Function to handle changes on invoice items
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If productId changes, update item details from products
    if (field === "productId") {
      const product = products.find((p) => p._id === value);
      if (product) {
        newItems[index].rate = product.price || 0;
        newItems[index].tax = product.tax || 18;
        newItems[index].unit = product.unit || "";
        newItems[index].length = product.length || 0;
        newItems[index].pcs = product.pcs || 0;
      } else {
        // Clear product details if not found
        newItems[index].rate = 0;
        newItems[index].tax = 0;
        newItems[index].unit = "";
        newItems[index].length = 0;
        newItems[index].pcs = 0;
      }
    }

    setInvoice({ ...invoice, items: newItems });
  };

  // Add new empty item
  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        {
          productId: "",
          unit: "",
          length: 0,
          pcs: 0,
          rate: 0,
          tax: 18,
          quantity: 1,
          price: 0,
        },
      ],
    });
  };

  // Calculate totals
  // const calculateTotal = () => {
  //   let subtotal = 0;
  //   let gstTotal = 0;

  //   invoice.items.forEach((item) => {
  //     const qty = Number(item.quantity || 0);
  //     const price = Number(item.rate || 0);
  //     const gstRate = Number(item.tax || 0);
  //     const base = qty * price;
  //     const gstAmt = (base * gstRate) / 100;
  //     subtotal += base;
  //     gstTotal += gstAmt;
  //   });

  //   const discount = Number(invoice.totalDiscount || 0);
  //   const crimpingCharges = Number(invoice.crimpingCharges || 0);
  //   const deliveryCharges = Number(invoice.deliveryCharges || 0);

  //   const roundingOff =
  //     Math.round(
  //       subtotal + gstTotal - discount + crimpingCharges + deliveryCharges
  //     ) -
  //     (subtotal + gstTotal - discount + crimpingCharges + deliveryCharges);

  //   const grandTotal =
  //     subtotal +
  //     gstTotal -
  //     discount +
  //     crimpingCharges +
  //     deliveryCharges +
  //     roundingOff;

  //   const paid = Number(invoice.paid || 0);
  //   const balance = grandTotal - paid;

  //   return { subtotal, gstTotal, roundingOff, grandTotal, balance };
  // };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const totals = calculateTotal();
    try {
      const newInvoice = await createInvoice(invoice);
      navigate(`/invoice/${newInvoice._id}/preview`);
      alert("Invoice created!");
      // Reset form or navigate away here if needed
      setInvoice(initialInvoice);
    } catch (err) {
      console.error("Error creating invoice", err);
      alert("Failed to create invoice");
    }
  };

  // const totals = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        🧾 Create Invoice
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer selection */}
        <div>
          <label className="block font-medium">Customer</label>
          <select
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            value={invoice.customer}
            onChange={(e) =>
              setInvoice({ ...invoice, customer: e.target.value })
            }
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice items */}
        <div>
          <label className="block font-medium text-lg mb-3">Items</label>
          {invoice.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-7 gap-4 mb-4 p-4 bg-gray-50 rounded-md shadow-sm transition-transform hover:scale-[1.01] duration-300"
            >
              {/* Product Select */}
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium mb-1">Product</label>
                <select
                  className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(index, "productId", e.target.value)
                  }
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Unit</label>
                <select
                  className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={item.unit}
                  onChange={(e) =>
                    handleItemChange(index, "unit", e.target.value)
                  }
                  required
                >
                  <option value="">Select Unit</option>
                  <option value="feet">feet</option>
                  <option value="No's">No's</option>
                </select>
              </div>

              {/* Length */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Length</label>
                <input
                  type="text"
                  className={`border border-gray-300 p-2 rounded-md shadow-sm ${
                    item.unit !== "feet" ? "bg-gray-100" : ""
                  }`}
                  value={item.length}
                  onChange={(e) =>
                    handleItemChange(index, "length", e.target.value)
                  }
                  disabled={item.unit !== "feet"}
                  required={item.unit === "feet"}
                />
              </div>

              {/* Pieces */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Pieces</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100"
                  value={item.pcs}
                  onChange={(e) =>
                    handleItemChange(index, "pcs", e.target.value)
                  }
                  required
                />
              </div>

              {/* Rate */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Price</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(index, "rate", e.target.value)
                  }
                  required
                />
              </div>

              {/* Tax */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">GST %</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100"
                  value={item.tax}
                  onChange={(e) =>
                    handleItemChange(index, "tax", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            + Add Item
          </button>
        </div>

        {/* Bank and other details */}
        <div className="grid grid-cols-2 gap-4">
          {/* You can keep these inputs unchanged, just making sure controlled inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Bank
            </label>

            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.customerBank}
              onChange={(e) =>
                setInvoice({ ...invoice, customerBank: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Account Number
            </label>

            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.customerACNumber}
              onChange={(e) =>
                setInvoice({ ...invoice, customerACNumber: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Branch
            </label>

            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.accountBranch}
              onChange={(e) =>
                setInvoice({ ...invoice, accountBranch: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ifsc Code
            </label>

            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.ifscCode}
              onChange={(e) =>
                setInvoice({ ...invoice, ifscCode: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transportation Mode
            </label>

            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.transportationMode}
              onChange={(e) =>
                setInvoice({ ...invoice, transportationMode: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number
            </label>

            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.vehicleNumber}
              onChange={(e) =>
                setInvoice({ ...invoice, vehicleNumber: e.target.value })
              }
              // required
            />
          </div>
          <div>
            {" "}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Name
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.driverName}
              onChange={(e) =>
                setInvoice({ ...invoice, driverName: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Contact Number
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.driverContactNumber}
              onChange={(e) =>
                setInvoice({ ...invoice, driverContactNumber: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Place
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.deliveryPlace}
              onChange={(e) =>
                setInvoice({ ...invoice, deliveryPlace: e.target.value })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crimping Charges
            </label>

            <input
              type="number"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.crimpingCharges}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  crimpingCharges: Number(e.target.value),
                })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Charges
            </label>

            <input
              type="number"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.deliveryCharges}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  deliveryCharges: Number(e.target.value),
                })
              }
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Discount
            </label>
            <input
              type="number"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.totalDiscount}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  totalDiscount: Number(e.target.value),
                })
              }
              // required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={invoice.date}
              onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
            />
          </div>
        </div>

        {/* Totals display */}
        {/* <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <strong>Subtotal:</strong> ₹{totals.subtotal.toFixed(2)}
          </div>
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <strong>GST Total:</strong> ₹{totals.gstTotal.toFixed(2)}
          </div>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <strong>Rounding Off:</strong> ₹{totals.roundingOff.toFixed(2)}
          </div>
          <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
            <strong>Grand Total:</strong> ₹{totals.grandTotal.toFixed(2)}
          </div>
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <strong>Balance:</strong> ₹{totals.balance.toFixed(2)}
          </div>
        </div> */}

        <button
          type="submit"
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
