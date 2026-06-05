import Link from "next/link";
import { Check, Eye, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  onAdd: () => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const canBuy = product.active && product.stock > 0;

  return (
    <article className={`product-card group ${!canBuy ? "opacity-70" : ""}`}>
      <div className={`product-art bg-gradient-to-br ${product.gradient}`}>
        <div className="product-chip">{product.tag}</div>
        <div className="product-glow" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">{product.name}</h3>
            <p className="mt-1 text-sm text-cyan-100/70">{product.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-cyan-100">{formatPrice(product.price)}</p>
            {product.oldPrice ? <p className="text-sm text-slate-500 line-through">{formatPrice(product.oldPrice)}</p> : null}
          </div>
        </div>

        <p className="mt-4 min-h-12 text-sm leading-6 text-slate-300">{product.description}</p>

        <div className="mt-4 grid gap-2">
          {product.features.map((feature) => (
            <div className="flex items-center gap-2 text-sm text-slate-300" key={feature}>
              <Check className="size-4 text-emerald-300" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            {product.stock} ключей
          </span>
          <div className="flex gap-2">
            <Link className="ghost-mini-button" href={`/product/${product.id}`} aria-label="Открыть товар">
              <Eye className="size-4" />
            </Link>
            <button className="small-primary-button" onClick={onAdd} disabled={!canBuy}>
              <ShoppingCart className="size-4" />
              {canBuy ? "В корзину" : "Нет ключей"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
