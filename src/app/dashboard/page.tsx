// src/app/dashboard/page.tsx

"use client";
import Banner from "@/components/Banner";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  size: string;
  color: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]); // ✅ Wishlist product IDs

  const userId = "demo-user-123"; // Replace later with real logged-in user

  // ✅ Extract clean image URL
  const getCleanImageUrl = (url: string): string => {
    try {
      if (url.includes("google.com/imgres")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const imgUrl = urlParams.get("imgurl");
        return imgUrl || url;
      }
      return url;
    } catch {
      return url;
    }
  };

  // ✅ Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (Array.isArray(data)) {
        const ids = data.map((item: any) => item.productId);
        setWishlist(ids);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await fetch("/api/userProducts");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  // ✅ Handle Add to Cart
  const handleAddToCart = async (product: Product) => {
    try {
      setLoadingId(product._id);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      alert(`✅ "${product.name}" added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add to cart.");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Add/Remove Wishlist (API integration)
  const handleWishlistToggle = async (productId: string) => {
    try {
      setLoadingId(productId);
      const isWishlisted = wishlist.includes(productId);

      if (isWishlisted) {
        // 🔹 Remove from wishlist
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to remove");
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        // 🔹 Add to wishlist
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add");
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("❌ Failed to update wishlist.");
    } finally {
      setLoadingId(null);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <>
      <Banner />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Our Collection
            </h1>
            <p className="text-gray-600">
              Discover amazing products at great prices
            </p>
          </div>

          {/* ✅ Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item) => {
              const cleanImageUrl = getCleanImageUrl(item.image);
              const isWishlisted = wishlist.includes(item._id);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 relative"
                >
                  {/* ✅ Wishlist Button */}
                  <button
                    onClick={() => handleWishlistToggle(item._id)}
                    className="absolute top-3 left-3 z-10"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={24}
                      className={`transition-colors ${
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <Link href={`/product/${item._id}`}>
                    <img
                      src={cleanImageUrl}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(
                          item.name
                        )}`;
                      }}
                    />
                    </Link>
                    <div
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                        item.stock > 5
                          ? "bg-green-100 text-green-800"
                          : item.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.stock > 5
                        ? "In Stock"
                        : item.stock > 0
                        ? `Only ${item.stock} left`
                        : "Out of Stock"}
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {item.name}
                    </h2>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{item.price}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Color:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            {item.color}
                          </span>
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: item.color.toLowerCase(),
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{item.size}</span>
                      </div>
                    </div>

                    {/* ✅ Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0 || loadingId === item._id}
                      className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        item.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : loadingId === item._id
                          ? "bg-blue-400"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {loadingId === item._id
                        ? "Adding..."
                        : item.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>
              Showing {products.length} product
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
