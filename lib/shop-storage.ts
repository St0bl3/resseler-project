"use client";

import { useEffect, useMemo, useState } from "react";
import { products as defaultProducts } from "@/lib/products";
import type { CartItem, Product, ProductKey } from "@/lib/types";

const PRODUCTS_KEY = "resselerhubw.products";
const KEYS_KEY = "resselerhubw.keys";
const CART_KEY = "resselerhubw.cart";

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
      products.map((product) => {
        const productKeys = keys.filter((key) => key.productId === product.id);
        return {
          ...product,
          stock: productKeys.length ? productKeys.filter((key) => key.status === "active").length : product.stock
        };
      }),
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

  function addToCart(product: Product) {
    if (!product.active || product.stock < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.min(quantity, item.stock) } : item))
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
  return defaultProducts.flatMap((product) =>
    Array.from({ length: Math.min(product.stock, 12) }, (_, index) => ({
      id: `${product.id}-seed-${index}`,
      productId: product.id,
      value: `RH-${product.id.slice(4, 9).toUpperCase()}-${String(index + 1).padStart(4, "0")}-DEMO`,
      status: "active" as const
    }))
  );
}
