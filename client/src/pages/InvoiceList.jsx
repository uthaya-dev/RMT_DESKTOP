import { useEffect, useState } from "react";
import { getInvoices } from "../services/invoiceService";
import { useNavigate } from "react-router-dom";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInvoices(); // fetch with default status=active
        setInvoices(data.invoices);
      } catch (err) {
        console.error("Error fetching invoices", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h2>

      {loading ? (
        <div className="text-gray-500">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="text-gray-500">No invoices found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="py-3 px-6 border-b">#</th>
                <th className="py-3 px-6 border-b">Invoice No</th>
                <th className="py-3 px-6 border-b">Customer</th>
                <th className="py-3 px-6 border-b">Total</th>
                <th className="py-3 px-6 border-b">Date</th>
                <th className="py-3 px-6 border-b">Balance</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr
                  key={invoice._id}
                  onClick={() => navigate(`/invoice/${invoice._id}`)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6 font-medium text-blue-600">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="py-3 px-6">{invoice.customerName}</td>
                  <td className="py-3 px-6 text-green-600 font-semibold">
                    ₹{invoice.grandTotal?.toFixed(2)}
                  </td>
                  <td className="py-3 px-6">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td
                    className={`py-3 px-6 font-medium ${
                      invoice.balance > 0 ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    ₹{invoice.balance?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
