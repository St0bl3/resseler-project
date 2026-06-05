import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "traceless-crack",
    name: "Traceless Crack",
    subtitle: "CS2 private access",
    tag: "CS2",
    description: "Фиксированный доступ Traceless для тестовой выдачи ключа на email.",
    features: ["Один тестовый ключ", "Email delivery", "Фиксированная цена"],
    stock: 1,
    active: true,
    gradient: "from-zinc-950 via-slate-950 to-cyan-950",
    variants: [
      { id: "single", name: "1 ключ", price: 7, days: 0 }
    ]
  }
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id && product.active);
}
