"use client";

import { useEffect, useMemo, useState } from "react";
import { products as defaultProducts } from "@/lib/products";
import type { CartItem, Product, ProductKey, ProductVariant } from "@/lib/types";

const PRODUCTS_KEY = "resselerhub.products";
const KEYS_KEY = "resselerhub.keys";
const CART_KEY = "resselerhub.cart";

export function useShopData() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [keys, setKeys] = useState<ProductKey[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProducts(readJson(PRODUCTS_KEY, defaultProducts));
    setKeys(readJson(KEYS_KEY, createSeedKeys()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(KEYS_KEY, JSON.stringify(keys));
  }, [keys, ready]);

  const productsWithStock = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        stock: keys.filter((key) => key.productId === product.id && key.status === "active").length || product.stock
      })),
    [products, keys]
  );

  function updateProduct(productId: string, patch: Partial<Product>) {
    setProducts((current) => current.map((product) => (product.id === productId ? { ...product, ...patch } : product)));
  }

  function addKeys(productId: string, values: string[]) {
    const cleanValues = values.map((value) => value.trim()).filter(Boolean);
    setKeys((current) => [
      ...current,
      ...cleanValues.map((value) => ({
        id: `${productId}-${crypto.randomUUID()}`,
        productId,
        value,
        status: "active" as const
      }))
    ]);
  }

  function updateKey(keyId: string, status: ProductKey["status"]) {
    setKeys((current) =>
      current.map((key) =>
        key.id === keyId
          ? {
              ...key,
              status,
              soldAt: status === "sold" ? new Date().toISOString() : key.soldAt
            }
          : key
      )
    );
  }

  function removeKey(keyId: string) {
    setKeys((current) => current.filter((key) => key.id !== keyId));
  }

  function resetDemoData() {
    setProducts(defaultProducts);
    setKeys(createSeedKeys());
  }

  return {
    products: productsWithStock,
    keys,
    updateProduct,
    addKeys,
    updateKey,
    removeKey,
    resetDemoData
  };
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readJson(CART_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  function addToCart(product: Product, variant: ProductVariant) {
    if (!product.active || product.stock < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.variantId === variant.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.variantId === variant.id
            ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
            : item
        );
      }
      return [
        ...current,
        {
          ...product,
          quantity: Math.min(product.stock, 1),
          variantId: variant.id,
          variantName: variant.name,
          price: variant.price
        }
      ];
    });
  }

  function updateQuantity(productId: string, variantId: string, quantity: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId && item.variantId === variantId
            ? { ...item, quantity: Math.min(item.stock, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return {
    cart,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    updateQuantity,
    clearCart: () => setCart([])
  };
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function createSeedKeys(): ProductKey[] {
  return [
    {
      id: `${defaultProducts[0].id}-seed-0`,
      productId: defaultProducts[0].id,
      value: "fdsyfy41dfsdfysj14kkfa14",
      status: "active" as const
    }
  ];
}
