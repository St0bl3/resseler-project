import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { deliverKeysByEmail } from "@/lib/key-delivery";
import { getProductById } from "@/lib/products";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email ?? session.customer_email ?? session.metadata?.email;
    const metadataItems = session.metadata?.items;

    if (email && metadataItems) {
      const parsedItems = JSON.parse(metadataItems) as Array<{ id: string; quantity: number }>;
      const deliverableItems = parsedItems
        .map((item) => ({ product: getProductById(item.id), quantity: item.quantity }))
        .filter((item) => item.product && item.quantity > 0)
        .map((item) => ({ name: item.product!.name, quantity: item.quantity }));

      await deliverKeysByEmail({
        email,
        orderId: session.id,
        items: deliverableItems
      });
    }
  }

  return NextResponse.json({ received: true });
}
