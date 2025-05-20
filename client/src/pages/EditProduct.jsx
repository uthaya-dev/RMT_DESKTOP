import React, { useEffect, useState } from "react";
import axios from "axios";
import { getProductById } from "../services/productService";

const EditProduct = ({ match }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(match.params.id);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [match.params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProduct(match.params.id, product);
      console.log("Product updated:", response.data);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update product</h2>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        required
      />
      <input
        type="text"
        value={product.hsn}
        onChange={(e) => setProduct({ ...customer, hsn: e.target.value })}
        required
      />
      <button type="submit">Update Product</button>
    </form>
  );
};

export default EditProduct;
