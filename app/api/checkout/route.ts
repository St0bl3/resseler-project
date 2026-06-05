import { NextResponse } from "next/server";
import { deliverKeysByEmail } from "@/lib/key-delivery";
import { getProductById } from "@/lib/products";

type CheckoutBody = {
  email?: string;
  items?: Array<{
    id?: string;
    variantId?: string;
    quantity?: number;
  }>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const email = body.email?.trim();
  const firstItem = body.items?.[0];

  if (!email || !emailPattern.test(email) || !firstItem?.id || !firstItem.variantId) {
    return NextResponse.json({ error: "Укажи email и добавь товар в корзину." }, { status: 400 });
  }

  const product = getProductById(firstItem.id);
  if (!product) {
    return NextResponse.json({ error: "Товар не найден." }, { status: 404 });
  }

  const variant = product.variants.find((item) => item.id === firstItem.variantId);
  if (!variant) {
    return NextResponse.json({ error: "Срок подписки не найден." }, { status: 404 });
  }

  const quantity = 1;
  const orderId = `order_${Date.now()}`;
  let sent: Awaited<ReturnType<typeof deliverKeysByEmail>>;

  try {
    sent = await deliverKeysByEmail({
      email,
      orderId,
      items: [
        {
          name: `${product.name} (${variant.name})`,
          quantity
        }
      ]
    });
  } catch {
    return NextResponse.json({ error: "Заказ создан, но письмо не отправилось. Проверь RESEND_API_KEY и отправителя." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message: sent.delivered
      ? `Оплата прошла, ключ отправлен на ${email}.`
      : `Оплата прошла, тестовый ключ подготовлен для ${email}.`,
    orderId
  });
}
