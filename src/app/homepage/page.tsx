//app/homepage/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 shadow-md bg-white">
        {/* Logo / Brand */}
        <h2 className="text-xl font-bold text-gray-800">🛒 My E-Commerce</h2>

        {/* Auth Buttons */}
        <div className="space-x-4">
          <button>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </button>
          
          <button>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          🚀 Welcome to My E-Commerce App
        </h1>
      </main>
    </div>
  );
}
