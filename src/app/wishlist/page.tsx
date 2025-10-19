// app/wishlist/page.tsx

"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistItem {
  _id: string;
  productId: string;
  product: Product | null;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = "demo-user-123"; // Replace with logged-in user ID

  // ✅ Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove item from wishlist
  const handleRemove = async (productId: string) => {
    try {
      setLoadingId(productId);
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove item");

      // Update local list
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      console.error("Error removing item:", err);
      alert("❌ Failed to remove item from wishlist.");
    } finally {
      setLoadingId(null);
    }
  };

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

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading your wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          💖 My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-20">
            Your wishlist is empty. Start adding some products!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="relative">
                    {/* <img
                      src={
                        product.image ||
                        `https://via.placeholder.com/300x300?text=${encodeURIComponent(
                          product.name
                        )}`
                      }
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    /> */}
                    <img
                      src={
                        getCleanImageUrl(item.product?.image || "") ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.product?.name || "Product"}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => handleRemove(product._id)}
                      disabled={loadingId === product._id}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2
                        size={20}
                        className={`${
                          loadingId === product._id
                            ? "text-gray-400"
                            : "text-red-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h2>
                    <p className="text-blue-600 font-bold text-xl mt-2">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={() => alert("🛒 Add to Cart functionality here")}
                      className="mt-4 w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
