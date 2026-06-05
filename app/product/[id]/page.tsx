"use client";

import Link from "next/link";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductCover } from "@/components/product-cover";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/products";
import { useCart, useShopData } from "@/lib/shop-storage";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const [cartOpen, setCartOpen] = useState(false);
  const [variantId] = useState("single");
  const { products } = useShopData();
  const { cart, cartCount, addToCart, updateQuantity, clearCart } = useCart();

  const product = useMemo(() => products.find((item) => item.id === params.id && item.active), [products, params.id]);
  const variant = product?.variants.find((item) => item.id === variantId) ?? product?.variants[0];
  const inStock = Boolean(product && product.stock > 0);

  if (!product || !variant) {
    return (
      <main className="min-h-screen bg-[#02030a] text-slate-50">
        <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white">Товар не найден</h1>
          <Link className="primary-button mt-6 inline-flex" href="/catalog">
            <ArrowLeft className="size-5" />
            Назад
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#02030a] text-slate-50">
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="product-detail-art">
          <ProductCover large />
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-6">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-cyan-200" href="/catalog">
            <ArrowLeft className="size-4" />
            Назад в каталог
          </Link>

          <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-lg text-cyan-100/70">{product.description}</p>

          <div className="mt-6 grid gap-3">
            {product.features.map((feature) => (
              <div className="flex items-center gap-3 text-slate-300" key={feature}>
                <Check className="size-5 text-emerald-300" />
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-slate-400">Доступ</p>
            <p className="mt-1 text-lg font-black text-white">{variant.name}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#040710] p-5">
            <div>
              <p className="text-sm text-slate-400">Цена</p>
              <p className="text-3xl font-black text-cyan-100">{formatPrice(variant.price)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">В наличии</p>
              <p className="text-3xl font-black text-white">{product.stock}</p>
            </div>
            <button
              className="primary-button"
              disabled={!inStock}
              onClick={() => {
                addToCart(product, variant);
                setCartOpen(true);
              }}
            >
              <ShoppingCart className="size-5" />
              {inStock ? "В корзину" : "Нет в наличии"}
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
