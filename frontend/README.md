
# Aramti Website

سایت شرکتی چندزبانه‌ی Aramti با React و Vite.

## اجرا

```bash
npm install
npm run dev
```

## ساخت نسخه‌ی نهایی

```bash
npm run build
```

## ساختار

معماری پروژه Feature-based و سبک است:

- فایل‌های `Page.jsx` فقط بخش‌های صفحه را کنار هم قرار می‌دهند.
- کامپوننت‌های مخصوص هر صفحه در `pages/<page>/components` هستند.
- داده‌های ساختاریافته در `content/` قرار دارند.
- تمام متن‌ها از `locales/en` و `locales/fa` خوانده می‌شوند.
- استایل مرجع در `styles/index.css` است.
- RTL و موبایل به‌ترتیب در `rtl.css` و `mobile.css` override می‌شوند.

جزئیات کامل در [ARCHITECTURE.md](./ARCHITECTURE.md) نوشته شده است.

## Auth frontend

The login, sign-up, email verification, forgot-password, language switcher, and header auth states are implemented on the frontend.

For local setup:

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set the Django API origin when the backend is available. The expected backend contract is documented in `AUTH_BACKEND_CONTRACT.md`. OAuth provider secrets must stay on the backend.
