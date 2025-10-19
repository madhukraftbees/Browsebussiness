// //app/admin/products/page.tsx

"use client";

import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    size: "M",
    color: "",
    image: "",
  });

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Handle Add Product
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Handle Edit button click
  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      size: product.size || "M",
      color: product.color || "",
      image: product.image || "",
    });
    setShowEditForm(true);
  };

  // 🔹 Handle Edit Submit (PUT)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const res = await fetch(`/api/admin/products/${selectedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");

      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );

      setShowEditForm(false);
      setSelectedProduct(null);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Handle Delete Product (DELETE)
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      price: "",
      stock: "",
      size: "M",
      color: "",
      image: "",
    });
  };

  if (loading) return <p className="p-4">Loading products...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📦 Manage Products</h1>

      <button
        onClick={() => setShowAddForm(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Add Product
      </button>

      {/* 🟢 Add Product Modal */}
      {showAddForm && (
        <Modal
          title="Add Product"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* 🟢 Edit Product Modal */}
      {showEditForm && (
        <Modal
          title="Edit Product"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* 🟢 Products Table */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Brand
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Color
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Stock
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {product._id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.brand}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{product.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.color}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.stock || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ✅ Reusable Modal Component */
function Modal({
  title,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: {
  title: string;
  formData: any;
  setFormData: any;
  onSubmit: any;
  onCancel: any;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-lg w-96 space-y-3"
      >
        <h2 className="text-xl font-bold mb-2">{title}</h2>

        <input
          type="text"
          placeholder="Brand"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Size (S, M, L, XL)"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <div className="flex justify-end space-x-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
