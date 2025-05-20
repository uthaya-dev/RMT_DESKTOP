import bgImage from "../assets/bg.jpg";

import { Link } from "react-router-dom";
import { FaFileInvoice, FaUser, FaBox } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-7xl w-full py-16">
        <h1 className="text-4xl font-extrabold text-white text-center mb-14 drop-shadow-md animate-fade-down">
          🚀 Invoice Dashboard
        </h1>

        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4">
          {/* CARD TEMPLATE */}
          {[
            {
              title: "Invoices",
              icon: <FaFileInvoice className="text-3xl text-blue-400" />,
              links: [
                { to: "/invoices", label: "📄 View Invoices" },
                { to: "/invoices/new", label: "➕ Create Invoice" },
              ],
            },
            {
              title: "Customers",
              icon: <FaUser className="text-3xl text-purple-400" />,
              links: [
                { to: "/customers", label: "👥 View Customers" },
                { to: "/customers/new", label: "➕ Add Customer" },
              ],
            },
            {
              title: "Products",
              icon: <FaBox className="text-3xl text-yellow-400" />,
              links: [
                { to: "/products", label: "📦 View Products" },
                { to: "/products/new", label: "➕ Add Product" },
              ],
            },
          ].map((section, i) => (
            <div
              key={section.title}
              className={`rounded-2xl p-6 bg-white shadow-md hover:shadow-2xl transform transition duration-500 hover:scale-[1.03] animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                {section.icon}
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
