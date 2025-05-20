import React, { useEffect, useState } from "react";
import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "../services/productService";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // To handle editing state

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log("RAW product data:", response);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      console.log("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Handle update product
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateProduct(id, updatedData); // Call the update API
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, ...updatedData } : product
        )
      );
      setEditingProduct(null); // Reset the editing state
      console.log("Product updated successfully", products);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg "
      style={{ backgroundImage: "url('/src/assets/bg.jpg')" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Hsn Code</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{product.name}</td>
                  <td className="py-3 px-6">{product.hsn}</td>
                  <td className="py-3 px-6 text-center space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal or Edit Form */}
      {editingProduct && (
        <div
          className="fixed inset-0 min-h-screen flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg "
          style={{ backgroundImage: "url('/src/assets/bg.jpg')" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  name: e.target.name.value,
                  hsn: e.target.hsn.value,
                };
                handleUpdate(editingProduct._id, updatedData);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Hsn Code
                </label>
                <input
                  type="hsn"
                  name="hsn"
                  defaultValue={editingProduct.hsn}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)} // Close the modal
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
