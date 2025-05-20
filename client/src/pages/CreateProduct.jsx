import React, { useState } from "react";
import { createProduct } from "../services/productService";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [hsn, setHsn] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = { name, hsn };

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setTimeout(() => {
      navigate(-1); // Go one step back
    }, 1000);
    try {
      const productData = await createProduct(newProduct);
      setSuccessMessage("Product created successfully!");
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="grid h-screen place-items-center bg-white p-8 rounded-lg shadow-lg "
      style={{ backgroundImage: "url('/src/assets/bg.jpg')" }}
    >
      <form onSubmit={handleSubmit} style={{ width: "50%" }}>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Prodcut
        </h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Prodcut Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="HSN Code"
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-md transition duration-200 ${
              loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>

      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage("")}
        />
      )}
      {error && (
        <Toast message={error} type="error" onClose={() => setError("")} />
      )}
    </div>
  );
};

export default CreateProduct;
