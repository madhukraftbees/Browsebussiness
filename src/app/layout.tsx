//src/app/layout.tsx

"use client";

import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header & footer on specific routes
  const hideHeaderFooter = ["/login", "/register"].includes(pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <CartProvider>{children}</CartProvider>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
