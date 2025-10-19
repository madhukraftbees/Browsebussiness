// app/page.tsx
import { products } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-6 p-10">
      {products.map((p) => (
        <div key={p.id} className="border rounded p-4">
          <Link href={`/product/${p.id}`}>
            <Image
              src={p.image}
              alt={p.name}
              className="w-full h-80 object-cover"
              width={300}
              height={300}
            />
            <h2 className="text-lg font-semibold">{p.name}</h2>
          </Link>
          <p>₹{p.price}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
