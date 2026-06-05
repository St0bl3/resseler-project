# ResselerHub

Магазин CS2-ключей на Next.js.

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

Добавьте в `Settings -> Environment Variables`, затем сделайте redeploy.

```bash
NEXT_PUBLIC_SITE_URL=https://resselerhub.xyz
ADMIN_USER=admin
ADMIN_PASSWORD=your-strong-password
RESEND_API_KEY=re_your_key
KEYS_FROM_EMAIL=ResselerHub <keys@resselerhub.xyz>
TEST_DELIVERY_KEY=fdsyfy41dfsdfysj14kkfa14
```

`RESEND_API_KEY` нельзя хранить в коде или показывать публично. Если ключ уже был отправлен в чат, лучше удалить его в Resend и создать новый.

`KEYS_FROM_EMAIL` должен быть адресом, который разрешён в Resend. Для `keys@resselerhub.xyz` нужно подтвердить домен `resselerhub.xyz` в Resend.

## Админка

Обычные пользователи не видят ссылок на `/admin`. Сама страница закрыта Basic Auth через `ADMIN_USER` и `ADMIN_PASSWORD`.

Важно: текущая админка хранит товар и ключи в браузере через `localStorage`. Для настоящих продаж нужна серверная база данных.

## Vercel DNS

Для apex-домена `resselerhub.xyz` у DNS-провайдера должен быть A-record:

```text
Type: A
Name: @
Value: 216.198.79.1
```

Если используете `www.resselerhub.xyz`, добавьте CNAME:

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```
