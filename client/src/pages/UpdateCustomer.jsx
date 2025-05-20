import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateCustomer = ({ match }) => {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customers/${match.params.id}`);
        setCustomer(response.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, [match.params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `/api/customers/${match.params.id}`,
        customer
      );
      console.log("Customer updated:", response.data);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Customer</h2>
      <input
        type="text"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        required
      />
      <input
        type="text"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        required
      />
      <input
        type="email"
        value={customer.email}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        required
      />
      <textarea
        value={customer.address}
        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
        required
      />
      <button type="submit">Update Customer</button>
    </form>
  );
};

export default UpdateCustomer;
