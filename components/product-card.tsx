import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ProductCover } from "@/components/product-cover";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link className="product-card group block" href={`/product/${product.id}`}>
      <div className="product-art">
        <ProductCover />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">{product.name}</h3>
            <p className="mt-1 text-sm text-cyan-100/70">{product.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">от</p>
            <p className="text-2xl font-black text-cyan-100">{formatPrice(product.variants[0]?.price ?? 0)}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300">{product.description}</p>

        <div className="mt-4 grid gap-2">
          {product.features.map((feature) => (
            <div className="flex items-center gap-2 text-sm text-slate-300" key={feature}>
              <Check className="size-4 text-emerald-300" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-100">
          Открыть
          <ArrowRight className="size-4" />
        </div>
      </div>
    </Link>
  );
}
