//app/admin/layout.tsx

"use client";

import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>/
          <Link href="/admin/products" className="hover:bg-gray-700 p-2 rounded">
            Products
          </Link>/
          <Link href="/admin/orders" className="hover:bg-gray-700 p-2 rounded">
            Orders
          </Link>/
          <Link href="/admin/users" className="hover:bg-gray-700 p-2 rounded">
            Users
          </Link>/
          <Link href="/admin/banner" className="hover:bg-gray-700 p-2 rounded">
            Banner
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
