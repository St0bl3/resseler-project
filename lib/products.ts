import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "cs2-prime-drop-vault",
    name: "Prime Drop Vault",
    subtitle: "DLC ключ доступа к премиальным дропам",
    tag: "Prime DLC",
    price: 14.99,
    oldPrice: 19.99,
    description: "Цифровой ключ для CS2 с моментальной выдачей после подтверждения платежа.",
    features: ["Steam activation", "Email delivery", "EU/Global key"],
    stock: 42,
    active: true,
    gradient: "from-cyan-300 via-blue-500 to-indigo-600",
    stripePriceId: "price_replace_prime_drop_vault"
  },
  {
    id: "cs2-operation-loadout",
    name: "Operation Loadout",
    subtitle: "Набор DLC для соревновательной загрузки",
    tag: "Bundle",
    price: 24.99,
    oldPrice: 34.99,
    description: "Бандл ключей для игроков, которым нужен аккуратный стартовый комплект.",
    features: ["Bundle key", "Fast checkout", "Support ready"],
    stock: 27,
    active: true,
    gradient: "from-blue-300 via-cyan-500 to-sky-700",
    stripePriceId: "price_replace_operation_loadout"
  },
  {
    id: "cs2-gamma-case-pass",
    name: "Resseler Case Pass",
    subtitle: "DLC пропуск для кейс-доступа",
    tag: "Case Pass",
    price: 9.99,
    description: "Недорогой цифровой ключ для тестового запуска магазина и первых продаж.",
    features: ["Budget pick", "Instant email", "Webhook delivery"],
    stock: 64,
    active: true,
    gradient: "from-emerald-300 via-cyan-500 to-blue-700",
    stripePriceId: "price_replace_gamma_case_pass"
  }
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
