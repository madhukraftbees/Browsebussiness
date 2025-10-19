// app/cart/page.tsx

"use client";
import { useEffect, useState } from "react";

interface CartItem {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Cart Items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data: CartItemWithProduct[] = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Extract real image URL from Google redirect
  const getCleanImageUrl = (url: string) => {
    try {
      if (url.includes("google.com/imgres")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get("imgurl") || url;
      }
      return url;
    } catch {
      return url;
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">🛒 Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={getCleanImageUrl(item.product?.image || "") || "https://via.placeholder.com/80"}
                alt={item.product?.name || "Product"}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">
                  {item.product?.name || "Unknown Product"}
                </h2>
                {item.product?.color && <p className="text-gray-600 text-sm">Color: {item.product.color}</p>}
                {item.product?.size && <p className="text-gray-600 text-sm">Size: {item.product.size}</p>}
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
              </div>
            </div>
            <div className="text-right mt-4 sm:mt-0 font-bold text-lg text-blue-600">
              ₹{(item.product?.price || 0) * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center text-lg font-semibold">
        <span>Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
        <span>Total Price: ₹{totalPrice}</span>
      </div>

      {/* Checkout Button */}
      <div className="mt-6 text-right">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
