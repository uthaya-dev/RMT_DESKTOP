import axios from "axios";

const API_URL = "http://localhost:3001/api/invoices"; // Adjust base URL if needed

// Get all invoices
export const getInvoices = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  const response = await axios.post(API_URL, invoiceData);
  return response.data;
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update an invoice
export const updateInvoice = async (id, invoiceData) => {
  const response = await axios.put(`${API_URL}/${id}`, invoiceData);
  return response.data;
};

// Delete an invoice (hard delete)
export const deleteInvoice = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Soft delete an invoice (if your API supports soft delete)
export const softDeleteInvoice = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/soft-delete`);
  return response.data;
};

// Restore a soft-deleted invoice
export const restoreInvoice = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/restore`);
  return response.data;
};
