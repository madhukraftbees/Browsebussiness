// src/app/admin/banner/page.tsx

"use client";

import { useState, useEffect } from "react";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  createdAt: string;
}

export default function BannerAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
  });

  // Clean image URL (if pasted from Google Images)
  const getCleanImageUrl = (url: string): string => {
    try {
      if (url.includes("google.com/imgres")) {
        const params = new URLSearchParams(new URL(url).search);
        return params.get("imgurl") || url;
      }
      return url;
    } catch {
      return url;
    }
  };

  // 🟢 Fetch Banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/banner");
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 🟢 Add Banner
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add banner");

      const newBanner = await res.json();
      setBanners([...banners, newBanner]);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to add banner.");
    }
  };

  // 🟡 Edit Banner (Prefill Modal)
  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
    });
    setShowModal(true);
  };

  // 🟢 Update Banner
  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    try {
      const res = await fetch(`/api/admin/banner/${editingBanner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update banner");

      const updatedBanner = await res.json();

      setBanners(
        banners.map((b) => (b._id === editingBanner._id ? updatedBanner : b))
      );

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to update banner.");
    }
  };

  // 🔴 Delete Banner
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banner/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");
      setBanners(banners.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner.");
    }
  };

  // Close Modal and Reset Form
  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ title: "", subtitle: "", image: "", link: "" });
  };

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading banners...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            🎨 Manage Banners
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Banner
          </button>
        </div>

        {/* 🧾 Banner List */}
        {banners.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No banners found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={getCleanImageUrl(banner.image)}
                  alt={banner.title}
                  className="w-full h-40 object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/400x200?text=No+Image")
                  }
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {banner.title}
                  </h2>
                  <p className="text-sm text-gray-600">{banner.subtitle}</p>
                  <a
                    href={banner.link}
                    target="_blank"
                    className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                  >
                    {banner.link}
                  </a>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🟢 Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={editingBanner ? handleUpdateBanner : handleAddBanner}
            className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-3"
          >
            <h2 className="text-lg font-semibold mb-2">
              {editingBanner ? "✏️ Edit Banner" : "➕ Add New Banner"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="border p-2 w-full rounded"
              required
            />
            {formData.image && (
              <img
                src={getCleanImageUrl(formData.image)}
                alt="Preview"
                className="w-full h-32 object-cover rounded"
              />
            )}
            <input
              type="text"
              placeholder="Redirect Link"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="border p-2 w-full rounded"
              required
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded ${
                  editingBanner
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {editingBanner ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
