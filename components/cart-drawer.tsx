"use client";

import { CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { formatPrice } from "@/lib/products";
import type { CartItem } from "@/lib/types";

type CartDrawerProps = {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onQuantityChange: (productId: string, variantId: string, quantity: number) => void;
  onClear: () => void;
};

export function CartDrawer({ cart, isOpen, onClose, onQuantityChange, onClear }: CartDrawerProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: cart.map((item) => ({
            id: item.id,
            variantId: item.variantId,
            quantity: item.quantity
          }))
        })
      });

      const payload = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(payload.error ?? "Не удалось оформить заказ.");

      setMessage(payload.message ?? "Оплата прошла, ключ отправлен на email.");
      setSuccess(true);
      onClear();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Что-то пошло не так.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`drawer-shell ${isOpen ? "drawer-open" : ""}`} aria-hidden={!isOpen}>
      {success ? (
        <div className="success-glow" role="status" aria-live="polite">
          <div className="success-orbit" />
          <CheckCircle2 className="success-check" />
          <h2>Оплата прошла</h2>
          <p>{message}</p>
          <button
            className="primary-button mt-6"
            onClick={() => {
              setSuccess(false);
              setMessage("");
              onClose();
            }}
          >
            Готово
          </button>
        </div>
      ) : null}
      <button className="drawer-backdrop" onClick={onClose} aria-label="Закрыть корзину" />
      <aside className="drawer-panel">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Корзина</p>
            <h2 className="mt-1 text-2xl font-black text-white">Заказ</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Закрыть корзину">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag className="size-12 text-cyan-200" />
              <p className="mt-4 text-lg font-bold text-white">Корзина пустая</p>
              <span>Открой товар и выбери срок.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div className="cart-line" key={`${item.id}-${item.variantId}`}>
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-cyan-100">{item.variantName}</p>
                    <p className="mt-1 text-sm text-slate-400">{formatPrice(item.price)} за доступ</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="qty-button" onClick={() => onQuantityChange(item.id, item.variantId, item.quantity - 1)} aria-label="Уменьшить">
                      <Minus className="size-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button className="qty-button" onClick={() => onQuantityChange(item.id, item.variantId, item.quantity + 1)} aria-label="Увеличить">
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form className="border-t border-white/10 p-5" onSubmit={handleCheckout}>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            className="checkout-input"
            id="email"
            type="email"
            required
            placeholder="player@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <div className="mt-4 flex items-center justify-between text-lg">
            <span className="text-slate-300">Итого</span>
            <strong className="text-2xl text-cyan-100">{formatPrice(total)}</strong>
          </div>

          {message ? <p className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-50">{message}</p> : null}

          <div className="mt-5 flex gap-3">
            <button className="danger-button" type="button" onClick={onClear} disabled={cart.length === 0} aria-label="Очистить корзину">
              <Trash2 className="size-4" />
            </button>
            <button className="checkout-button" disabled={cart.length === 0 || loading}>
              {loading ? <Loader2 className="size-5 animate-spin" /> : <ShoppingBag className="size-5" />}
              Оплатить
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
