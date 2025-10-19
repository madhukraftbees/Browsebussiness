// sre/components/Banner.tsx

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Banner() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/admin/banner");
        if (!res.ok) throw new Error("Failed to fetch banners");
        const data = await res.json();
        console.log("✅ Banner_response", data);
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setError("Failed to load banners. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000); // change every 3 seconds
    return () => clearInterval(interval);
  }, [banners]);
  function getDirectImageUrl(url: string) {
    try {
      // Extract actual image from Google redirect
      const match = url.match(/imgurl=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
      return url; // Return as-is if already direct
    } catch {
      return url;
    }
  }

  if (loading) {
    return (
      <section className="flex justify-center items-center h-64 text-white bg-blue-600">
        <p>Loading banners...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center h-64 text-red-500 bg-gray-100">
        <p>{error}</p>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner._id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* Text Section */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {currentBanner.title}
              </h2>
              <p className="text-lg text-blue-100 mb-6">
                {currentBanner.subtitle}
              </p>
              <a
                href={currentBanner.link}
                className="inline-block bg-white text-blue-700 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition"
              >
                Learn More
              </a>
            </div>

            {/* Image Section */}
            <div className="flex-1 flex justify-center">
              <img
                src={getDirectImageUrl(currentBanner.image)}
                alt={currentBanner.title}
                className="w-full max-w-md rounded-xl shadow-lg object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400?text=Image+Not+Found")
                }
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
}
