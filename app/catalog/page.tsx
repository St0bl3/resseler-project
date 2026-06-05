"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { useCart, useShopData } from "@/lib/shop-storage";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const { products } = useShopData();
  const { cart, cartCount, addToCart, updateQuantity, clearCart } = useCart();

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matches = [product.name, product.subtitle, product.tag].some((value) => value.toLowerCase().includes(normalized));
      return product.active && (!normalized || matches);
    });
  }, [products, query]);

  return (
    <main className="min-h-screen bg-[#030814] text-slate-50">
      <div className="ambient ambient-a" />
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Каталог</p>
            <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">DLC ключи CS2</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Наличие берется из активных ключей, которые загружены в админ-панели.</p>
          </div>
          <label className="search-box">
            <Search className="size-5 text-cyan-200" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти товар" />
          </label>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => {
                addToCart(product);
                setCartOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      <CartDrawer
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onQuantityChange={updateQuantity}
        onClear={clearCart}
      />
    </main>
  );
}
