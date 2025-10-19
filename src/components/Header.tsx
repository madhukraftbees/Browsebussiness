// sre/components/Header.tsx

"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, ChevronDown, Search } from "lucide-react";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MyStore
        </Link>

        {/* 🔍 Search Bar */}
        <div className="flex items-center border rounded-lg px-3 py-1 w-1/3 bg-gray-50">
          <Search className="text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products, categories..."
            className="ml-2 w-full outline-none bg-transparent text-gray-700"
          />
        </div>

        {/* Navigation + Profile + Cart */}
        <div className="flex items-center gap-6 text-gray-700 font-medium relative">
          <Link
            href="/dashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-600 transition-colors"
          >
            Contact
          </Link>

          {/* 🧑 Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              Profile <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  My Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => alert("Logged out")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* 🛒 Cart Icon */}
          <Link
            href="/cart"
            className="relative hover:text-blue-600 transition"
          >
            <ShoppingCart size={24} />
            {/* 🔵 Cart count badge */}
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
