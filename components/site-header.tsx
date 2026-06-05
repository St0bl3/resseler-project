"use client";

import Link from "next/link";
import { Gamepad2, LayoutDashboard, ShoppingCart } from "lucide-react";

type SiteHeaderProps = {
  cartCount: number;
  onCartOpen: () => void;
  showAdminLink?: boolean;
};

export function SiteHeader({ cartCount, onCartOpen, showAdminLink = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-[#030814]/78 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <div className="grid size-11 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,.18)]">
            <Gamepad2 className="size-6 text-cyan-200" />
          </div>
          <div>
            <p className="text-base font-black uppercase tracking-[0.16em] text-white sm:text-lg">ResselerHub</p>
            <p className="text-xs text-cyan-100/70">CS2 DLC keys</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link className="nav-link" href="/">
            Главная
          </Link>
          <Link className="nav-link" href="/catalog">
            Каталог
          </Link>
          {showAdminLink ? (
            <Link className="nav-link" href="/admin">
              Админка
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {showAdminLink ? (
            <Link className="icon-button" href="/admin" aria-label="Открыть админку">
              <LayoutDashboard className="size-5" />
            </Link>
          ) : null}
          <button className="icon-button relative" onClick={onCartOpen} aria-label="Открыть корзину">
            <ShoppingCart className="size-5" />
            {cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
          </button>
        </div>
      </nav>
    </header>
  );
}
