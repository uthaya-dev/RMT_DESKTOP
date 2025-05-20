import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/invoices/${id}`);
        setInvoice(res.data);
      } catch (err) {
        console.error("Error fetching invoice", err);
      }
    };
    fetchInvoice();
  }, [id]);

  if (!invoice) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Invoice #{invoice.invoiceNumber}
      </h2>
      <div className="mb-4">
        <p>
          <strong>Customer:</strong> {invoice.customer?.name}
        </p>
        <p>
          <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
        </p>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">GST%</th>
            <th className="border p-2">GST Amt</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={item._id}>
              <td className="border p-2 text-center">{idx + 1}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-right">₹{item.price}</td>
              <td className="border p-2 text-right">{item.gstRate}%</td>
              <td className="border p-2 text-right">₹{item.gstAmount}</td>
              <td className="border p-2 text-right">₹{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-4 space-y-1">
        <p>
          <strong>Subtotal:</strong> ₹{invoice.subtotal}
        </p>
        <p>
          <strong>GST Total:</strong> ₹{invoice.gstTotal}
        </p>
        <p>
          <strong>Discount:</strong> ₹{invoice.discount}
        </p>
        <p>
          <strong>Rounding Off:</strong> ₹{invoice.roundingOff}
        </p>
        <p>
          <strong>Grand Total:</strong> ₹{invoice.grandTotal}
        </p>
        <p>
          <strong>Paid:</strong> ₹{invoice.paid}
        </p>
        <p>
          <strong>Balance:</strong> ₹{invoice.balance}
        </p>
      </div>
    </div>
  );
};

export default InvoiceDetails;
