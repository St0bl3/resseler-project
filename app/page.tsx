"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Gamepad2, Mail, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { useCart, useShopData } from "@/lib/shop-storage";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const { products } = useShopData();
  const { cart, cartCount, addToCart, updateQuantity, clearCart } = useCart();
  const featuredProducts = products.filter((product) => product.active).slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030814] text-slate-50">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl content-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <Sparkles className="size-4" />
            ResselerHub готов к Vercel, Stripe и email-выдаче
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            ResselerHub
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Магазин цифровых DLC-ключей для Counter-Strike 2 с удобной корзиной, отдельным каталогом и админ-панелью
            для управления товарами, ключами, активностью и наличием.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="primary-button" href="/catalog">
              <Zap className="size-5" />
              Открыть каталог
            </Link>
            <Link className="ghost-button" href="/admin">
              <ShieldCheck className="size-5" />
              Админ-панель
            </Link>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["Ключи", "счетчик наличия"],
              ["Stripe", "checkout готов"],
              ["Email", "автовыдача"]
            ].map(([title, label]) => (
              <div className="stat-tile" key={title}>
                <strong>{title}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[620px]">
          <div className="hero-panel">
            <div className="hero-grid" />
            <div className="weapon-card card-float-a">
              <span className="skin-line" />
              <p>RESSELERHUB</p>
              <strong>CS2 DLC Keys</strong>
              <small>stock controlled by admin</small>
            </div>
            <div className="weapon-card card-float-b">
              <span className="skin-line alt" />
              <p>AUTO DELIVERY</p>
              <strong>Email after payment</strong>
              <small>Stripe webhook ready</small>
            </div>
            <div className="scope-ring">
              <div />
            </div>
            <div className="hero-core">
              <Gamepad2 className="size-20 text-cyan-100" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 bg-[#050b19]/90 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Популярное</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Ключи в наличии</h2>
            </div>
            <Link className="ghost-button hidden sm:inline-flex" href="/catalog">
              Все товары
              <ArrowRight className="size-5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
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

          <div className="mt-8 grid gap-4 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.05] p-5 md:grid-cols-3">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-300" />
              <p className="text-sm leading-6 text-slate-300">Главная, каталог, товар и админка теперь разделены по разным страницам.</p>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-1 size-5 shrink-0 text-cyan-200" />
              <p className="text-sm leading-6 text-slate-300">После Stripe webhook письмо с ключом уйдет покупателю на email.</p>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 size-5 shrink-0 text-blue-200" />
              <p className="text-sm leading-6 text-slate-300">В админке можно включать товары и управлять активными ключами.</p>
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
