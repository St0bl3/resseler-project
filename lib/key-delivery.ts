import { Resend } from "resend";

type DeliveryInput = {
  email: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
};

const defaultTestKey = "fdsyfy41dfsdfysj14kkfa14";

export async function deliverKeysByEmail({ email, orderId, items }: DeliveryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.KEYS_FROM_EMAIL ?? "ResselerHub <keys@example.com>";

  const generatedKeys = items.flatMap((item) =>
    Array.from({ length: item.quantity }, (_, index) => ({
      product: item.name,
      key: process.env.TEST_DELIVERY_KEY ?? (index === 0 ? defaultTestKey : createDemoKey(orderId, item.name, index))
    }))
  );

  if (!apiKey) {
    console.info("RESEND_API_KEY is not configured. Demo keys were generated:", generatedKeys);
    return { delivered: false, generatedKeys };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: email,
    subject: "Ваши CS2 DLC ключи от ResselerHub",
    html: renderKeyEmail(orderId, generatedKeys)
  });

  return { delivered: true, generatedKeys };
}

function createDemoKey(orderId: string, productName: string, index: number) {
  const seed = `${orderId}-${productName}-${index}`.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return `GK-${seed.slice(0, 5).padEnd(5, "X")}-${seed.slice(5, 10).padEnd(5, "7")}-${seed.slice(10, 15).padEnd(5, "Q")}`;
}

function renderKeyEmail(orderId: string, keys: Array<{ product: string; key: string }>) {
  const rows = keys
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #16304d;color:#c8e9ff;">${escapeHtml(item.product)}</td>
          <td style="padding:12px;border-bottom:1px solid #16304d;color:#67e8f9;font-weight:700;">${escapeHtml(item.key)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="background:#02030a;color:#f8fafc;font-family:Arial,sans-serif;padding:28px;">
      <h1 style="margin:0 0 8px;">ResselerHub</h1>
      <p style="color:#a8c7dd;">Спасибо за покупку. Заказ: ${escapeHtml(orderId)}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:20px;background:#061225;border:1px solid #16304d;">
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#7dd3fc;margin-top:20px;">Активируйте ключ в Steam и сохраните это письмо.</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
