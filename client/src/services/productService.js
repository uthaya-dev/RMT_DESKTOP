import axios from "axios";

const API_URL = "/api/products"; // Make sure your backend URL is correct

// Get all customers
export const getProducts = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Create a new Product
export const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};

// Update Product
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/${id}`, productData);
  return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

//Get Single Product
export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
