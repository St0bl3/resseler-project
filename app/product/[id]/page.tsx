"use client";

import Link from "next/link";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/products";
import { useCart, useShopData } from "@/lib/shop-storage";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const [cartOpen, setCartOpen] = useState(false);
  const { products } = useShopData();
  const { cart, cartCount, addToCart, updateQuantity, clearCart } = useCart();
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#030814] text-slate-50">
        <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black">Товар не найден</h1>
          <Link className="primary-button mt-6" href="/catalog">
            Вернуться в каталог
          </Link>
        </section>
      </main>
    );
  }

  const canBuy = product.active && product.stock > 0;

  return (
    <main className="min-h-screen bg-[#030814] text-slate-50">
      <div className="ambient ambient-b" />
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className={`product-detail-art bg-gradient-to-br ${product.gradient}`}>
          <div className="product-chip">{product.tag}</div>
        </div>

        <div className="rounded-lg border border-cyan-300/15 bg-white/[0.04] p-6">
          <Link className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-200" href="/catalog">
            <ArrowLeft className="size-4" />
            Назад в каталог
          </Link>
          <h1 className="text-4xl font-black text-white sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-lg text-cyan-100/75">{product.subtitle}</p>
          <p className="mt-5 leading-7 text-slate-300">{product.description}</p>

          <div className="mt-6 grid gap-3">
            {product.features.map((feature) => (
              <div className="flex items-center gap-3 text-slate-300" key={feature}>
                <Check className="size-5 text-emerald-300" />
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-cyan-300/15 bg-[#061225] p-5">
            <div>
              <p className="text-sm text-slate-400">Цена</p>
              <p className="text-3xl font-black text-cyan-100">{formatPrice(product.price)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">В наличии</p>
              <p className="text-3xl font-black text-white">{product.stock}</p>
            </div>
            <button
              className="primary-button"
              disabled={!canBuy}
              onClick={() => {
                addToCart(product);
                setCartOpen(true);
              }}
            >
              <ShoppingCart className="size-5" />
              {canBuy ? "Добавить в корзину" : "Нет активных ключей"}
            </button>
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
