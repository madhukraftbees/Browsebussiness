// src/components/Footer.tsx

export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">MyStore</h3>
            <p className="text-sm text-gray-400">
              Your one-stop shop for stylish and quality products.
            </p>
          </div>
  
          {/* Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
  
          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">Contact Us</h3>
            <p className="text-sm text-gray-400">Email: support@mystore.com</p>
            <p className="text-sm text-gray-400">Phone: +91 98765 43210</p>
          </div>
        </div>
  
        <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} MyStore. All rights reserved.
        </div>
      </footer>
    );
  }
  