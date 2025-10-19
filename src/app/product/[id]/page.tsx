// src/app/product/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart } from "lucide-react";

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

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const userId = "demo-user-123"; // Replace later with real user

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

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/userProducts/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product?._id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      alert(`✅ "${product?.name}" added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add to cart.");
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    const isWishlisted = wishlist.includes(product._id);
    const cleanImageUrl = getCleanImageUrl(product.image);

    try {
      const res = await fetch("/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      if (!res.ok) throw new Error("Wishlist update failed");

      setWishlist((prev) =>
        isWishlisted
          ? prev.filter((id) => id !== product._id)
          : [...prev, product._id]
      );
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Product not found.
      </div>
    );
  const cleanImageUrl = getCleanImageUrl(product.image);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <img
              src={cleanImageUrl}
              alt={product.name}
              className="rounded-lg w-full h-96 object-cover"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <button onClick={handleWishlistToggle}>
                <Heart
                  size={28}
                  className={`transition ${
                    wishlist.includes(product._id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>
            </div>

            <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>

            <p className="text-gray-600">Color: {product.color}</p>
            <p className="text-gray-600">Size: {product.size}</p>

            <p
              className={`font-semibold ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-2 px-4 mt-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// import { products } from "@/lib/products";
// import { useCart } from "@/context/CartContext";
// import Image from "next/image";

// export default function ProductPage({ params }: { params: { id: string } }) {
//   const product = products.find((p) => p.id === Number(params.id));
//   const { addToCart } = useCart();

//   if (!product) return <div>Product not found</div>;

//   return (
//     <div className="p-10">

//       <Image
//         src={product.image}
//         alt={product.name}
//         width={500}
//         height={500}
//         className="rounded-lg"
//       />
//       <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
//       <p className="text-gray-600">₹{product.price}</p>
//       <button
//         className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
//         onClick={() => addToCart(product)}
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// }
