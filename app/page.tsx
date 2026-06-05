"use client";

import Link from "next/link";
import { Gamepad2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { useCart, useShopData } from "@/lib/shop-storage";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  useShopData();
  const { cart, cartCount, updateQuantity, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-[#02030a] text-slate-50">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl content-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <div className="relative z-10">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-cyan-100">
            <Sparkles className="size-4" />
            Только CS2-раздел
          </div>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            ResselerHub
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Простой магазин с одним CS2-продуктом. Без лишних шагов: выбери срок, добавь в корзину и получи ключ на email.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="primary-button" href="/catalog">
              <Zap className="size-5" />
              В каталог
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px]">
          <div className="hero-panel">
            <div className="hero-grid" />
            <div className="scope-ring">
              <div />
            </div>
            <div className="hero-core">
              <Gamepad2 className="size-20 text-cyan-100" />
            </div>
          </div>
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
