# ResselerHub

Многостраничный магазин цифровых DLC-ключей для Counter-Strike 2 на Next.js.

## Страницы

- `/` главная
- `/catalog` каталог
- `/product/[id]` страница товара
- `/admin` закрытая админ-панель

## Запуск

```bash
npm install
npm run dev
```

## Переменные для Vercel

```bash
NEXT_PUBLIC_SITE_URL=https://resselerhubw.xyz
ADMIN_USER=admin
ADMIN_PASSWORD=your-strong-password
STRIPE_SECRET_KEY=sk_test_or_live_key
STRIPE_WEBHOOK_SECRET=whsec_from_stripe
RESEND_API_KEY=re_your_key
KEYS_FROM_EMAIL=ResselerHub <keys@resselerhubw.xyz>
```

## Защита админки

Страница `/admin` защищена серверным Basic Auth. Без `ADMIN_USER` и `ADMIN_PASSWORD` она не откроется.

На Vercel добавьте эти переменные в `Settings -> Environment Variables`, затем сделайте redeploy.

## Stripe webhook

```text
https://resselerhubw.xyz/api/stripe/webhook
```

Событие: `checkout.session.completed`.

## Важно

Сейчас админка хранит товары и ключи в браузере через localStorage. Для настоящих продаж нужно подключить серверную базу данных, например Supabase, Neon, Vercel Postgres или Firebase.
