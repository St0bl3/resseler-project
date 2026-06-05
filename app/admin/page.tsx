"use client";

import { KeyRound, RotateCcw, Save, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { useCart, useShopData } from "@/lib/shop-storage";
import type { ProductKey } from "@/lib/types";

export default function AdminPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, cartCount, updateQuantity, clearCart } = useCart();
  const { products, keys, updateProduct, addKeys, updateKey, removeKey, resetDemoData } = useShopData();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [keyText, setKeyText] = useState("");

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const selectedKeys = useMemo(
    () => keys.filter((key) => key.productId === selectedProduct?.id),
    [keys, selectedProduct?.id]
  );

  const stats = {
    active: keys.filter((key) => key.status === "active").length,
    sold: keys.filter((key) => key.status === "sold").length,
    disabled: keys.filter((key) => key.status === "disabled").length
  };

  function handleAddKeys(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProduct || !keyText.trim()) return;
    addKeys(
      selectedProduct.id,
      keyText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    );
    setKeyText("");
  }

  return (
    <main className="min-h-screen bg-[#030814] text-slate-50">
      <div className="ambient ambient-a" />
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} showAdminLink />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">Панель ResselerHub</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Управляй товарами, активностью, количеством и ключами. Счетчик наличия на сайте считается по активным ключам.
            </p>
          </div>
          <button className="ghost-button" onClick={resetDemoData}>
            <RotateCcw className="size-5" />
            Сбросить демо
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="stat-tile">
            <strong>{stats.active}</strong>
            <span>активных ключей</span>
          </div>
          <div className="stat-tile">
            <strong>{stats.sold}</strong>
            <span>продано</span>
          </div>
          <div className="stat-tile">
            <strong>{stats.disabled}</strong>
            <span>выключено</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="admin-panel">
            <h2 className="text-2xl font-black">Товары</h2>
            <div className="mt-5 space-y-3">
              {products.map((product) => (
                <button
                  className={`admin-product ${selectedProduct?.id === product.id ? "admin-product-active" : ""}`}
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.active ? "Активен" : "Скрыт"} · {product.stock} ключей</small>
                  </span>
                  <span className="text-cyan-100">${product.price}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedProduct ? (
            <div className="admin-panel">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">{selectedProduct.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">ID: {selectedProduct.id}</p>
                </div>
                <label className="toggle-line">
                  <input
                    type="checkbox"
                    checked={selectedProduct.active}
                    onChange={(event) => updateProduct(selectedProduct.id, { active: event.target.checked })}
                  />
                  Товар активен
                </label>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <label className="field-label">
                  Название
                  <input
                    className="checkout-input mt-2"
                    value={selectedProduct.name}
                    onChange={(event) => updateProduct(selectedProduct.id, { name: event.target.value })}
                  />
                </label>
                <label className="field-label">
                  Цена, USD
                  <input
                    className="checkout-input mt-2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={selectedProduct.price}
                    onChange={(event) => updateProduct(selectedProduct.id, { price: Number(event.target.value) })}
                  />
                </label>
                <label className="field-label">
                  Ручной запас без ключей
                  <input
                    className="checkout-input mt-2"
                    type="number"
                    min="0"
                    value={selectedProduct.stock}
                    onChange={(event) => updateProduct(selectedProduct.id, { stock: Number(event.target.value) })}
                  />
                </label>
              </div>

              <label className="field-label mt-4">
                Описание
                <textarea
                  className="admin-textarea mt-2"
                  value={selectedProduct.description}
                  onChange={(event) => updateProduct(selectedProduct.id, { description: event.target.value })}
                />
              </label>

              <form className="mt-6 rounded-lg border border-cyan-300/15 bg-[#061225] p-4" onSubmit={handleAddKeys}>
                <div className="flex items-center gap-2">
                  <KeyRound className="size-5 text-cyan-200" />
                  <h3 className="font-black">Загрузить ключи</h3>
                </div>
                <textarea
                  className="admin-textarea mt-3"
                  placeholder={"Один ключ на строку\nAAAA-BBBB-CCCC\nDDDD-EEEE-FFFF"}
                  value={keyText}
                  onChange={(event) => setKeyText(event.target.value)}
                />
                <button className="primary-button mt-3">
                  <Save className="size-5" />
                  Добавить ключи
                </button>
              </form>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-black">Ключи товара</h3>
                  <span className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-sm font-bold text-cyan-100">
                    Активных: {selectedKeys.filter((key) => key.status === "active").length}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedKeys.map((key) => (
                    <KeyRow keyItem={key} key={key.id} onStatusChange={updateKey} onRemove={removeKey} />
                  ))}
                  {selectedKeys.length === 0 ? (
                    <div className="empty-cart min-h-40">
                      <KeyRound className="size-10 text-cyan-200" />
                      <p className="mt-3 font-bold text-white">Ключей пока нет</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
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

function KeyRow({
  keyItem,
  onStatusChange,
  onRemove
}: {
  keyItem: ProductKey;
  onStatusChange: (keyId: string, status: ProductKey["status"]) => void;
  onRemove: (keyId: string) => void;
}) {
  return (
    <div className="key-row">
      <code>{keyItem.value}</code>
      <select value={keyItem.status} onChange={(event) => onStatusChange(keyItem.id, event.target.value as ProductKey["status"])}>
        <option value="active">active</option>
        <option value="sold">sold</option>
        <option value="disabled">disabled</option>
      </select>
      <button className="danger-button" onClick={() => onRemove(keyItem.id)} aria-label="Удалить ключ">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
