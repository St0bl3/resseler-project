import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";

type CheckoutBody = {
  email?: string;
  items?: Array<{
    id: string;
    quantity: number;
  }>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutBody;
  const email = body.email?.trim();
  const items = body.items ?? [];

  if (!email || items.length === 0) {
    return NextResponse.json({ error: "Укажите email и добавьте товар в корзину." }, { status: 400 });
  }

  const cartItems = items.map((item) => ({ product: getProductById(item.id), quantity: item.quantity }));
  if (cartItems.some((item) => !item.product || item.quantity < 1)) {
    return NextResponse.json({ error: "В корзине есть недоступный товар." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!stripeKey || stripeKey.includes("replace_me")) {
    return NextResponse.json({
      message: "Демо-режим: Stripe ключ еще не указан. После настройки будет открываться Stripe Checkout.",
      order: {
        email,
        items: cartItems.map(({ product, quantity }) => ({ id: product!.id, name: product!.name, quantity }))
      }
    });
  }

  const stripe = new Stripe(stripeKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
    metadata: {
      email,
      items: JSON.stringify(cartItems.map(({ product, quantity }) => ({ id: product!.id, quantity })))
    },
    line_items: cartItems.map(({ product, quantity }) => {
      if (product!.stripePriceId && !product!.stripePriceId.includes("replace")) {
        return {
          price: product!.stripePriceId,
          quantity
        };
      }

      return {
        quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: product!.name,
            description: product!.subtitle
          },
          unit_amount: Math.round(product!.price * 100)
        }
      };
    })
  });

  return NextResponse.json({ url: session.url });
}
