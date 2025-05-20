import React, { useState } from "react";
import { createCustomer } from "../services/customerService";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";

const CreateCustomer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCustomer = { name, phone, email, address };

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setTimeout(() => {
      navigate(-1); // Go one step back
    }, 1000);
    try {
      const customerData = await createCustomer(newCustomer);
      setSuccessMessage("Customer created successfully!");
    } catch (err) {
      console.error("Error creating customer:", err);
      setError("Error creating customer. Please try again.");
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
          Create Customer
        </h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows="4"
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
            {loading ? "Creating..." : "Create Customer"}
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

export default CreateCustomer;
