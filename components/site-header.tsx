"use client";

import Link from "next/link";
import { Gamepad2, ShoppingCart } from "lucide-react";

type SiteHeaderProps = {
  cartCount: number;
  onCartOpen: () => void;
};

export function SiteHeader({ cartCount, onCartOpen }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#02030a]/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <div className="grid size-11 place-items-center rounded-lg border border-cyan-300/20 bg-white/[0.04] shadow-[0_0_30px_rgba(8,145,178,.14)]">
            <Gamepad2 className="size-6 text-cyan-100" />
          </div>
          <div>
            <p className="text-base font-black uppercase tracking-[0.16em] text-white sm:text-lg">ResselerHub</p>
            <p className="text-xs text-slate-400">CS2 DLC keys</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link className="nav-link" href="/">
            Главная
          </Link>
          <Link className="nav-link" href="/catalog">
            Каталог
          </Link>
        </div>

        <button className="icon-button relative" onClick={onCartOpen} aria-label="Открыть корзину">
          <ShoppingCart className="size-5" />
          {cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
        </button>
      </nav>
    </header>
  );
}
