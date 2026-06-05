"use client";

import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { useCart, useShopData } from "@/lib/shop-storage";

export default function CatalogPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const { products } = useShopData();
  const { cart, cartCount, updateQuantity, clearCart } = useCart();
  const product = products.find((item) => item.active);

  return (
    <main className="min-h-screen bg-[#02030a] text-slate-50">
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="section-kicker">CS2</p>
        <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">Раздел Counter-Strike 2</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Сейчас здесь один продукт. Открой карточку и выбери срок доступа на странице товара.
        </p>

        <div className="mt-8 max-w-xl">
          {product ? (
            <ProductCard product={product} />
          ) : (
            <div className="empty-cart min-h-48">
              <p className="font-bold text-white">Товар временно скрыт</p>
              <span>Загляни позже: каталог скоро вернется.</span>
            </div>
          )}
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
