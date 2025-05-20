import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoiceList from "./pages/InvoiceList";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetails from "./pages/InvoiceDetails";
import CustomersList from "./pages/CustomersList";
import CreateCustomer from "./pages/CreateCustomer"; // New component for creating customers
import UpdateCustomer from "./pages/UpdateCustomer"; // New component for updating customers
import ProductsList from "./pages/ProductsList"; // Import Products List
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import InvoicePreview from "./pages/InvoicePreview";
// import { ToastNotifications } from "./components/Toast";

export default function App() {
  return (
    <Router>
      {/* <ToastNotifications /> */}
      <Routes>
        {/* Dashboard route */}
        <Route path="/" element={<Dashboard />} />
        {/* Invoice routes */}
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<CreateInvoice />} />
        <Route path="/invoice/:id" element={<InvoiceDetails />} />
        <Route path="/invoice/create" element={<CreateInvoice />} />
        <Route path="/invoice/:id/preview" element={<InvoicePreview />} />
        {/* Customer routes */}
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/customers/new" element={<CreateCustomer />} />
        <Route path="/customers/update/:id" element={<UpdateCustomer />} />
        {/* Product routes */}
        <Route path="/products" element={<ProductsList />} />{" "}
        {/* Products list */}
        <Route path="/products/new" element={<CreateProduct />} />{" "}
        {/* Add Product */}
        <Route path="/products/edit/:id" element={<EditProduct />} />{" "}
        {/* Edit Product */}
      </Routes>
    </Router>
  );
}
