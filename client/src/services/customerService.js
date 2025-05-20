import axios from "axios";

const API_URL = "http://localhost:3001/api/customers"; // Make sure your backend URL is correct

// Get all customers
export const getCustomers = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Create a new customer
export const createCustomer = async (customerData) => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  const response = await axios.put(`${API_URL}/${id}`, customerData);
  return response.data;
};

// Delete customer
export const deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
